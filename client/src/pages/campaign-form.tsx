import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  FileText,
  Users,
  Clock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Campaign, Vacancy, Candidate } from "@shared/schema";

const DAYS_OF_WEEK = [
  { id: "monday", label: "Mon" },
  { id: "tuesday", label: "Tue" },
  { id: "wednesday", label: "Wed" },
  { id: "thursday", label: "Thu" },
  { id: "friday", label: "Fri" },
  { id: "saturday", label: "Sat" },
  { id: "sunday", label: "Sun" },
];

const DEFAULT_SCRIPT = `Hello, am I speaking with {{candidate_name}}?

Great! This is an AI assistant calling on behalf of [Company Name] regarding the {{vacancy_title}} position you applied for.

I'd like to ask you a few quick questions:

1. Are you still interested in this opportunity?
2. What is your current availability to start a new role?
3. What are your salary expectations for this position?
4. What is your notice period with your current employer?

Thank you for your time. Based on our conversation, I'll have a recruiter follow up with you shortly.`;

const campaignFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  vacancyId: z.string().optional(),
  scriptTemplate: z.string().min(10, "Script must be at least 10 characters"),
  callWindowStart: z.string(),
  callWindowEnd: z.string(),
  callWindowDays: z.array(z.string()).min(1, "Select at least one day"),
  maxConcurrentCalls: z.number().min(1).max(50),
  retryLimit: z.number().min(0).max(5),
  retryDelayMinutes: z.number().min(15).max(1440),
  candidateIds: z.array(z.string()).optional(),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

const STEPS = [
  { id: 1, title: "Script", icon: FileText },
  { id: 2, title: "Recipients", icon: Users },
  { id: 3, title: "Schedule", icon: Clock },
  { id: 4, title: "Retry Rules", icon: RefreshCw },
  { id: 5, title: "Review", icon: CheckCircle2 },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={`ml-2 text-sm hidden sm:inline ${
                isActive ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {step.title}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 lg:w-16 h-0.5 mx-2 ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function CampaignFormPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id && id !== "new";
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: ["/api/campaigns", id],
    enabled: isEditing,
  });

  const { data: vacancies = [] } = useQuery<Vacancy[]>({
    queryKey: ["/api/vacancies"],
  });

  const { data: candidates = [] } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      description: "",
      vacancyId: "",
      scriptTemplate: DEFAULT_SCRIPT,
      callWindowStart: "09:00",
      callWindowEnd: "18:00",
      callWindowDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      maxConcurrentCalls: 10,
      retryLimit: 2,
      retryDelayMinutes: 60,
      candidateIds: [],
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name,
        description: campaign.description || "",
        vacancyId: campaign.vacancyId || "",
        scriptTemplate: campaign.scriptTemplate,
        callWindowStart: campaign.callWindowStart,
        callWindowEnd: campaign.callWindowEnd,
        callWindowDays: campaign.callWindowDays || [],
        maxConcurrentCalls: campaign.maxConcurrentCalls,
        retryLimit: campaign.retryLimit,
        retryDelayMinutes: campaign.retryDelayMinutes,
        candidateIds: [],
      });
    }
  }, [campaign, form]);

  const createMutation = useMutation({
    mutationFn: async (data: CampaignFormValues) => {
      const response = await apiRequest("POST", "/api/campaigns", {
        ...data,
        candidateIds: selectedCandidates,
      });
      return response as Campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign created",
        description: "The campaign has been successfully created.",
      });
      navigate("/campaigns");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CampaignFormValues) => {
      const response = await apiRequest("PATCH", `/api/campaigns/${id}`, data);
      return response as Campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", id] });
      toast({
        title: "Campaign updated",
        description: "The campaign has been successfully updated.",
      });
      navigate("/campaigns");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CampaignFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const eligibleCandidates = candidates.filter(
    (c) => !c.isDnc && c.consentStatus === "granted"
  );

  const toggleCandidate = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const selectAllCandidates = () => {
    if (selectedCandidates.length === eligibleCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(eligibleCandidates.map((c) => c.id));
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Q1 Engineering Outreach"
                      {...field}
                      data-testid="input-campaign-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the campaign..."
                      {...field}
                      data-testid="textarea-campaign-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vacancyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Vacancy</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger data-testid="select-campaign-vacancy">
                        <SelectValue placeholder="Select a vacancy (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vacancies.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scriptTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Script *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the script for the AI voice agent..."
                      className="min-h-[250px] font-mono text-sm"
                      {...field}
                      data-testid="textarea-campaign-script"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {"{{candidate_name}}"} and {"{{vacancy_title}}"} as placeholders
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Select Recipients</h3>
                <p className="text-sm text-muted-foreground">
                  Only candidates with granted consent and not on DNC list are shown
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllCandidates}
                data-testid="button-select-all"
              >
                {selectedCandidates.length === eligibleCandidates.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
              {eligibleCandidates.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No eligible candidates found. Candidates must have granted consent and not be on the DNC list.
                  </p>
                </div>
              ) : (
                eligibleCandidates.map((candidate) => (
                  <label
                    key={candidate.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={() => toggleCandidate(candidate.id)}
                      data-testid={`checkbox-candidate-${candidate.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {candidate.email} • {candidate.phone}
                      </p>
                    </div>
                    <Badge variant="outline">{candidate.status}</Badge>
                  </label>
                ))
              )}
            </div>

            <p className="text-sm">
              <strong>{selectedCandidates.length}</strong> candidates selected
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="callWindowStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call Window Start</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        data-testid="input-call-window-start"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="callWindowEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call Window End</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        data-testid="input-call-window-end"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="callWindowDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active Days</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <label
                        key={day.id}
                        className={`flex items-center justify-center w-12 h-10 rounded-lg border cursor-pointer transition-colors ${
                          field.value?.includes(day.id)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={field.value?.includes(day.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value || []), day.id]);
                            } else {
                              field.onChange(
                                (field.value || []).filter((d) => d !== day.id)
                              );
                            }
                          }}
                        />
                        <span className="text-sm font-medium">{day.label}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxConcurrentCalls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Max Concurrent Calls: {field.value}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      data-testid="slider-max-concurrent"
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of simultaneous calls
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="retryLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retry Attempts: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      data-testid="slider-retry-limit"
                    />
                  </FormControl>
                  <FormDescription>
                    Number of retry attempts for unanswered calls
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="retryDelayMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retry Delay: {field.value} minutes</FormLabel>
                  <FormControl>
                    <Slider
                      min={15}
                      max={1440}
                      step={15}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      data-testid="slider-retry-delay"
                    />
                  </FormControl>
                  <FormDescription>
                    Time to wait between retry attempts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        const values = form.getValues();
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{values.name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vacancy</span>
                    <span className="font-medium">
                      {vacancies.find((v) => v.id === values.vacancyId)?.title || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipients</span>
                    <span className="font-medium">{selectedCandidates.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Call Window</span>
                    <span className="font-mono">
                      {values.callWindowStart} - {values.callWindowEnd}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Days</span>
                    <span>{values.callWindowDays?.length || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Concurrent</span>
                    <span>{values.maxConcurrentCalls}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Retry Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retry Attempts</span>
                  <span>{values.retryLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retry Delay</span>
                  <span>{values.retryDelayMinutes} minutes</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Script Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg overflow-x-auto">
                  {values.scriptTemplate?.slice(0, 500)}
                  {(values.scriptTemplate?.length || 0) > 500 && "..."}
                </pre>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/campaigns">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-campaign-form-title">
            {isEditing ? "Edit Campaign" : "Create Campaign"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update campaign settings" : "Set up a new AI voice campaign"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <StepIndicator currentStep={currentStep} />

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Configure the campaign details and call script"}
              {currentStep === 2 && "Select candidates to include in this campaign"}
              {currentStep === 3 && "Set calling hours and concurrency limits"}
              {currentStep === 4 && "Configure retry behavior for missed calls"}
              {currentStep === 5 && "Review your campaign settings before saving"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing && isLoading ? (
              <FormSkeleton />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {renderStepContent()}

                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <div>
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          data-testid="button-prev-step"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Link href="/campaigns">
                        <Button type="button" variant="ghost" data-testid="button-cancel">
                          Cancel
                        </Button>
                      </Link>
                      {currentStep < 5 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          data-testid="button-next-step"
                        >
                          Next
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isPending}
                          data-testid="button-save-campaign"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              {isEditing ? "Update Campaign" : "Create Campaign"}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
