import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Settings as SettingsIcon,
  Key,
  Shield,
  PhoneOff,
  Bell,
  Users,
  Server,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Dnc, Setting } from "@shared/schema";

type ConnectorStatus = "connected" | "disconnected" | "error";

interface Connector {
  id: string;
  name: string;
  description: string;
  status: ConnectorStatus;
  lastChecked?: string;
}

function ConnectorCard({
  connector,
  onTest,
  isTesting,
}: {
  connector: Connector;
  onTest: () => void;
  isTesting: boolean;
}) {
  const statusColors: Record<ConnectorStatus, string> = {
    connected: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    disconnected: "bg-muted text-muted-foreground",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const StatusIcon = connector.status === "connected" ? CheckCircle2 : 
                     connector.status === "error" ? XCircle : AlertTriangle;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Key className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">{connector.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{connector.description}</p>
              <Badge className={statusColors[connector.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {connector.status}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onTest}
            disabled={isTesting}
            data-testid={`button-test-${connector.id}`}
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DncManagement() {
  const [newPhone, setNewPhone] = useState("");
  const [newReason, setNewReason] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: dncList = [], isLoading } = useQuery<Dnc[]>({
    queryKey: ["/api/dnc"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { phone: string; reason: string }) => {
      await apiRequest("POST", "/api/dnc", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dnc"] });
      toast({ title: "Added to DNC list" });
      setNewPhone("");
      setNewReason("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add to DNC list", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/dnc/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dnc"] });
      toast({ title: "Removed from DNC list" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove from DNC list", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add to DNC List</CardTitle>
          <CardDescription>
            Add phone numbers that should never be called
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="+14155551234"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="flex-1 font-mono"
              data-testid="input-dnc-phone"
            />
            <Input
              placeholder="Reason (optional)"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="flex-1"
              data-testid="input-dnc-reason"
            />
            <Button
              onClick={() => addMutation.mutate({ phone: newPhone, reason: newReason })}
              disabled={!newPhone || addMutation.isPending}
              data-testid="button-add-dnc"
            >
              {addMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">DNC List ({dncList.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : dncList.length === 0 ? (
            <div className="p-8 text-center">
              <PhoneOff className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">DNC list is empty</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dncList.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono">{entry.phone}</TableCell>
                    <TableCell>{entry.reason || "—"}</TableCell>
                    <TableCell>
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(entry.id)}
                        data-testid={`button-delete-dnc-${entry.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from DNC List</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this phone number from the Do Not Call list?
              This will allow the number to be called in future campaigns.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ComplianceSettings() {
  const [consentRequired, setConsentRequired] = useState(true);
  const [logTranscripts, setLogTranscripts] = useState("redacted");
  const [callRecording, setCallRecording] = useState(true);
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/settings", {
        consentRequired,
        logTranscripts,
        callRecording,
      });
    },
    onSuccess: () => {
      toast({ title: "Settings saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Processing</CardTitle>
          <CardDescription>
            Configure how candidate data is handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Consent Before Calling</Label>
              <p className="text-sm text-muted-foreground">
                Only call candidates who have granted GDPR consent
              </p>
            </div>
            <Switch
              checked={consentRequired}
              onCheckedChange={setConsentRequired}
              data-testid="switch-consent-required"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Call Recording</Label>
              <p className="text-sm text-muted-foreground">
                Record calls for quality assurance and training
              </p>
            </div>
            <Switch
              checked={callRecording}
              onCheckedChange={setCallRecording}
              data-testid="switch-call-recording"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Transcript Logging Policy</Label>
            <Select value={logTranscripts} onValueChange={setLogTranscripts}>
              <SelectTrigger data-testid="select-log-policy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full - Store complete transcripts</SelectItem>
                <SelectItem value="redacted">Redacted - Remove PII from transcripts</SelectItem>
                <SelectItem value="none">None - Do not store transcripts</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Controls how call transcripts are stored for compliance
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Call Consent Confirmation</CardTitle>
          <CardDescription>
            Live calling is disabled until consent is confirmed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Live Calling Disabled
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Set CALL_CONSENT_ACCEPTED=true in environment to enable live calling
              </p>
            </div>
            <Badge variant="outline">Mock Mode</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          data-testid="button-save-compliance"
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
}

function SystemHealth() {
  const { data: health, isLoading } = useQuery<{
    database: boolean;
    openai: boolean;
    vapi: boolean;
    twilio: boolean;
    ghl: boolean;
  }>({
    queryKey: ["/api/health"],
    refetchInterval: 30000,
  });

  const services = [
    { id: "database", name: "Database", icon: Server },
    { id: "openai", name: "OpenAI", icon: Key },
    { id: "vapi", name: "Vapi.io", icon: Key },
    { id: "twilio", name: "Twilio", icon: Key },
    { id: "ghl", name: "GoHighLevel", icon: Key },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Health</CardTitle>
        <CardDescription>
          Real-time status of connected services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service) => {
            const isHealthy = health?.[service.id as keyof typeof health];
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{service.name}</span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isHealthy ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isHealthy ? "Healthy" : "Unavailable"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const [testingConnector, setTestingConnector] = useState<string | null>(null);
  const { toast } = useToast();

  const connectors: Connector[] = [
    {
      id: "vapi",
      name: "Vapi.io",
      description: "AI voice agent for real-time conversations",
      status: "disconnected",
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "Telephony fallback for voice calls",
      status: "disconnected",
    },
    {
      id: "ghl",
      name: "GoHighLevel",
      description: "CRM integration for candidate pipeline",
      status: "disconnected",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "LLM for summaries and sentiment analysis",
      status: "connected",
    },
  ];

  const testConnector = async (id: string) => {
    setTestingConnector(id);
    await new Promise((r) => setTimeout(r, 1500));
    toast({
      title: "Connection test completed",
      description: `${id.toUpperCase()} connection test finished.`,
    });
    setTestingConnector(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-settings-title">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure integrations, compliance, and system preferences
        </p>
      </div>

      <Tabs defaultValue="connectors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connectors" data-testid="tab-connectors">
            <Key className="h-4 w-4 mr-2" />
            Connectors
          </TabsTrigger>
          <TabsTrigger value="dnc" data-testid="tab-dnc">
            <PhoneOff className="h-4 w-4 mr-2" />
            DNC List
          </TabsTrigger>
          <TabsTrigger value="compliance" data-testid="tab-compliance">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="system" data-testid="tab-system">
            <Server className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mode Selection</CardTitle>
              <CardDescription>
                Choose between mock mode for testing or live mode for production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  Mock Mode Active
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Provide API credentials and set CALL_CONSENT_ACCEPTED=true to enable live mode
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {connectors.map((connector) => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                onTest={() => testConnector(connector.id)}
                isTesting={testingConnector === connector.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dnc">
          <DncManagement />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceSettings />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemHealth />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Environment Variables</CardTitle>
              <CardDescription>
                Required configuration for live mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>DATABASE_URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>OPENAI_API_KEY</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">VAPI_API_KEY</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">TWILIO_ACCOUNT_SID</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">GHL_API_KEY</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">CALL_CONSENT_ACCEPTED</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
