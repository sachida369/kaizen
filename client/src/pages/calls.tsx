import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Phone,
  Play,
  Pause,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Volume2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import type { Call, Candidate, Campaign } from "@shared/schema";

const outcomeColors: Record<string, string> = {
  interested: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  not_interested: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  no_answer: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  busy: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  voicemail: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  opt_out: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  callback: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  error: "bg-muted text-muted-foreground",
};

const sentimentColors: Record<string, string> = {
  positive: "text-green-600",
  neutral: "text-yellow-600",
  negative: "text-red-600",
};

function CallListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border rounded-lg">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center col-span-full">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Phone className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No calls yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Call logs will appear here once you start running campaigns.
      </p>
    </div>
  );
}

function TranscriptBubble({
  speaker,
  text,
  isAgent,
}: {
  speaker: string;
  text: string;
  isAgent: boolean;
}) {
  return (
    <div className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isAgent
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-xs font-medium mb-1 opacity-70">{speaker}</p>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}

function parseTranscript(transcript: string | null): Array<{ speaker: string; text: string; isAgent: boolean }> {
  if (!transcript) return [];
  
  const lines = transcript.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    const match = line.match(/^(Agent|Candidate|AI|User):\s*(.+)$/i);
    if (match) {
      const speaker = match[1];
      const isAgent = speaker.toLowerCase() === "agent" || speaker.toLowerCase() === "ai";
      return { speaker, text: match[2], isAgent };
    }
    return { speaker: "Unknown", text: line, isAgent: false };
  });
}

export default function CallsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const { data: calls = [], isLoading } = useQuery<Call[]>({
    queryKey: ["/api/calls"],
  });

  const { data: candidates = [] } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate?.name || "Unknown";
  };

  const getCampaignName = (campaignId: string | null) => {
    if (!campaignId) return "—";
    const campaign = campaigns.find((c) => c.id === campaignId);
    return campaign?.name || "Unknown";
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getOutcomeIcon = (outcome: string | null) => {
    switch (outcome) {
      case "interested":
        return <CheckCircle2 className="h-4 w-4" />;
      case "not_interested":
      case "opt_out":
        return <XCircle className="h-4 w-4" />;
      case "no_answer":
      case "busy":
      case "voicemail":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredCalls = calls.filter((call) => {
    const candidateName = getCandidateName(call.candidateId);
    const matchesSearch = candidateName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOutcome = outcomeFilter === "all" || call.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  const transcriptMessages = selectedCall ? parseTranscript(selectedCall.transcript) : [];

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-64px)]">
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-calls-title">Call Logs</h1>
            <p className="text-sm text-muted-foreground">
              Review call recordings, transcripts, and AI analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Call List - Left Column */}
          <div className="lg:col-span-3 flex flex-col min-h-0">
            <Card className="flex flex-col flex-1">
              <CardHeader className="pb-3 shrink-0">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search calls..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-calls"
                    />
                  </div>
                  <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                    <SelectTrigger data-testid="select-outcome-filter">
                      <SelectValue placeholder="Filter by outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Outcomes</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                      <SelectItem value="no_answer">No Answer</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="voicemail">Voicemail</SelectItem>
                      <SelectItem value="opt_out">Opt Out</SelectItem>
                      <SelectItem value="callback">Callback</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0">
                <ScrollArea className="h-full px-4 pb-4">
                  {isLoading ? (
                    <CallListSkeleton />
                  ) : filteredCalls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Filter className="h-10 w-10 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {calls.length === 0 ? "No calls yet" : "No calls match your filters"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredCalls.map((call) => (
                        <button
                          key={call.id}
                          onClick={() => setSelectedCall(call)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedCall?.id === call.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          data-testid={`button-call-${call.id}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {getCandidateName(call.candidateId)}
                            </span>
                            {call.outcome && (
                              <Badge className={`shrink-0 text-xs ${outcomeColors[call.outcome] || ""}`}>
                                {call.outcome.replace("_", " ")}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(call.duration)}
                            </span>
                            <span>{formatDate(call.createdAt)}</span>
                          </div>
                          {call.confidence !== null && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Confidence</span>
                                <span className="font-medium">{call.confidence}%</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${call.confidence}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Transcript - Center Column */}
          <div className="lg:col-span-5 flex flex-col min-h-0">
            <Card className="flex flex-col flex-1">
              <CardHeader className="shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Transcript</CardTitle>
                  {selectedCall?.audioUrl && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsPlaying(!isPlaying)}
                        data-testid="button-play-audio"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="w-32">
                        <Slider
                          value={[audioProgress]}
                          max={100}
                          step={1}
                          onValueChange={([value]) => setAudioProgress(value)}
                        />
                      </div>
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0">
                <ScrollArea className="h-full px-4 pb-4">
                  {!selectedCall ? (
                    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Select a call to view the transcript
                      </p>
                    </div>
                  ) : transcriptMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No transcript available for this call
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transcriptMessages.map((msg, index) => (
                        <TranscriptBubble
                          key={index}
                          speaker={msg.speaker}
                          text={msg.text}
                          isAgent={msg.isAgent}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Analysis - Right Column */}
          <div className="lg:col-span-4 flex flex-col min-h-0 gap-4">
            {/* Analysis Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedCall ? (
                  <p className="text-sm text-muted-foreground">
                    Select a call to view analysis
                  </p>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Outcome</p>
                      <div className="flex items-center gap-2">
                        {getOutcomeIcon(selectedCall.outcome)}
                        <Badge className={outcomeColors[selectedCall.outcome || ""] || ""}>
                          {selectedCall.outcome?.replace("_", " ") || "Unknown"}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Sentiment</p>
                      <p className={`font-medium ${sentimentColors[selectedCall.sentiment || "neutral"]}`}>
                        {selectedCall.sentiment ? selectedCall.sentiment.charAt(0).toUpperCase() + selectedCall.sentiment.slice(1) : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Confidence Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${selectedCall.confidence || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{selectedCall.confidence || 0}%</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Summary</p>
                      <p className="text-sm">
                        {selectedCall.summary || "No summary available"}
                      </p>
                    </div>

                    {selectedCall.extractedData && Object.keys(selectedCall.extractedData).length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Extracted Data</p>
                          <div className="space-y-2 text-sm">
                            {selectedCall.extractedData.intent && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Intent</span>
                                <span className="font-medium">{selectedCall.extractedData.intent}</span>
                              </div>
                            )}
                            {selectedCall.extractedData.availability && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Availability</span>
                                <span className="font-medium">{selectedCall.extractedData.availability}</span>
                              </div>
                            )}
                            {selectedCall.extractedData.salaryExpectation && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Salary Expectation</span>
                                <span className="font-medium">{selectedCall.extractedData.salaryExpectation}</span>
                              </div>
                            )}
                            {selectedCall.extractedData.noticePeriod && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Notice Period</span>
                                <span className="font-medium">{selectedCall.extractedData.noticePeriod}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!selectedCall ? (
                  <p className="text-sm text-muted-foreground">
                    Select a call to perform actions
                  </p>
                ) : (
                  <>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-schedule-interview"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Interview
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-sync-ghl"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Sync to GHL
                    </Button>
                    <Button
                      className="w-full justify-start text-destructive hover:text-destructive"
                      variant="outline"
                      data-testid="button-mark-dnc"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Mark as DNC
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* GHL Sync Status */}
            {selectedCall && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">GHL Sync Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCall.ghlSynced ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">
                        Synced {selectedCall.ghlSyncedAt && `on ${formatDate(selectedCall.ghlSyncedAt)}`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Not synced</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
