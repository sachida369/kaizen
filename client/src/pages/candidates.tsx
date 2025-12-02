import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Phone,
  Mail,
  FileText,
  Linkedin,
  Shield,
  ShieldOff,
  PhoneOff,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Candidate, Vacancy, Call } from "@shared/schema";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  screening: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  interview: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  offer: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  hired: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pool: "bg-muted text-muted-foreground",
};

const consentColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  granted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  revoked: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function CandidatesTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Consent</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5].map((i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No candidates yet</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        Add your first candidate to start building your talent pool and running campaigns.
      </p>
      <Link href="/candidates/new">
        <Button data-testid="button-create-first-candidate">
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </Link>
    </div>
  );
}

function CandidateDetailDialog({
  candidate,
  open,
  onOpenChange,
}: {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: calls = [] } = useQuery<Call[]>({
    queryKey: ["/api/calls", { candidateId: candidate?.id }],
    enabled: !!candidate?.id,
  });

  if (!candidate) return null;

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{candidate.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs">
                  <Phone className="h-3 w-3" />
                  {candidate.phone}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calls">Call History ({calls.length})</TabsTrigger>
            <TabsTrigger value="consent">GDPR & Consent</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <Badge className={statusColors[candidate.status]}>{candidate.status}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.tags?.length ? (
                      candidate.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
                {candidate.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                    <p className="text-sm">{candidate.notes}</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {candidate.cvUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">CV</h4>
                    <a
                      href={candidate.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View CV
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {candidate.linkedinUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">LinkedIn</h4>
                    <a
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      View Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {candidate.ghlContactId && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">GHL Sync</h4>
                    <Badge variant="outline" className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Synced: {candidate.ghlContactId}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calls" className="mt-4">
            <ScrollArea className="h-[300px]">
              {calls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Phone className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No call history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {calls.map((call) => (
                    <Card key={call.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={call.outcome === "interested" ? "default" : "secondary"}>
                                {call.outcome?.replace("_", " ") || "Unknown"}
                              </Badge>
                              {call.confidence !== null && (
                                <span className="text-xs text-muted-foreground">
                                  {call.confidence}% confidence
                                </span>
                              )}
                            </div>
                            {call.summary && (
                              <p className="text-sm text-muted-foreground mt-2">{call.summary}</p>
                            )}
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            {call.duration && `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, "0")}`}
                            <br />
                            {new Date(call.createdAt!).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="consent" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {candidate.consentStatus === "granted" ? (
                    <Shield className="h-5 w-5 text-green-500" />
                  ) : (
                    <ShieldOff className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <h4 className="font-medium">Data Processing Consent</h4>
                    <p className="text-sm text-muted-foreground">
                      Status: <Badge className={consentColors[candidate.consentStatus]}>{candidate.consentStatus}</Badge>
                    </p>
                  </div>
                </div>
                {candidate.consentTimestamp && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(candidate.consentTimestamp).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {candidate.isDnc ? (
                    <PhoneOff className="h-5 w-5 text-red-500" />
                  ) : (
                    <Phone className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <h4 className="font-medium">Do Not Call Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {candidate.isDnc ? "On DNC list - will not be called" : "Available for calls"}
                    </p>
                  </div>
                </div>
                {candidate.dncTimestamp && (
                  <p className="text-xs text-muted-foreground">
                    Added: {new Date(candidate.dncTimestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function CandidatesPage() {
  const searchParams = useSearch();
  const vacancyFilter = new URLSearchParams(searchParams).get("vacancy") || "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  const { data: candidates = [], isLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  const { data: vacancies = [] } = useQuery<Vacancy[]>({
    queryKey: ["/api/vacancies"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/candidates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      toast({
        title: "Candidate deleted",
        description: "The candidate has been successfully deleted.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete candidate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markDncMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/candidates/${id}`, { isDnc: true, dncTimestamp: new Date().toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      toast({
        title: "Added to DNC",
        description: "The candidate has been added to the Do Not Call list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update DNC status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesVacancy = !vacancyFilter || candidate.vacancyId === vacancyFilter;
    return matchesSearch && matchesStatus && matchesVacancy;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-candidates-title">Candidates</h1>
          <p className="text-sm text-muted-foreground">
            Manage your talent pool and track candidate progress
          </p>
        </div>
        <Link href="/candidates/new">
          <Button data-testid="button-add-candidate">
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-candidates"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pool">Pool</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <CandidatesTableSkeleton />
          ) : filteredCandidates.length === 0 && candidates.length === 0 ? (
            <EmptyState />
          ) : filteredCandidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No candidates match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Consent</TableHead>
                    <TableHead className="hidden lg:table-cell">Tags</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => {
                    const initials = candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <TableRow
                        key={candidate.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedCandidate(candidate)}
                        data-testid={`row-candidate-${candidate.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              {candidate.isDnc && (
                                <Badge variant="destructive" className="text-xs mt-0.5">
                                  <PhoneOff className="h-3 w-3 mr-1" />
                                  DNC
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {candidate.email}
                            </p>
                            <p className="text-sm font-mono flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {candidate.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[candidate.status]}>
                            {candidate.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={consentColors[candidate.consentStatus]}>
                            {candidate.consentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {candidate.tags?.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {(candidate.tags?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(candidate.tags?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                data-testid={`button-candidate-actions-${candidate.id}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/candidates/${candidate.id}`}>
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </Link>
                              {!candidate.isDnc && (
                                <DropdownMenuItem
                                  onClick={() => markDncMutation.mutate(candidate.id)}
                                >
                                  <PhoneOff className="mr-2 h-4 w-4" />
                                  Mark as DNC
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(candidate.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CandidateDetailDialog
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone
              and all associated call history will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
