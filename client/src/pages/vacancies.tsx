import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  MapPin,
  Building2,
  ExternalLink,
  Upload,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { parseCSV, generateCSVTemplate } from "@/lib/csvParser";
import type { Vacancy } from "@shared/schema";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  closed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  filled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function VacanciesTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applications</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5].map((i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
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
        <Building2 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No vacancies yet</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        Create your first job vacancy to start attracting candidates and running campaigns.
      </p>
      <Link href="/vacancies/new">
        <Button data-testid="button-create-first-vacancy">
          <Plus className="mr-2 h-4 w-4" />
          Create Vacancy
        </Button>
      </Link>
    </div>
  );
}

export default function VacanciesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCSVDialog, setShowCSVDialog] = useState(false);
  const [csvPreview, setCSVPreview] = useState<any[]>([]);
  const [csvErrors, setCSVErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: vacancies = [], isLoading } = useQuery<Vacancy[]>({
    queryKey: ["/api/vacancies"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/vacancies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
      toast({
        title: "Vacancy deleted",
        description: "The vacancy has been successfully deleted.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete vacancy. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/vacancies", data);
      return response as Vacancy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
    },
    onError: () => {
      throw new Error("Failed to create vacancy");
    },
  });

  const handleCSVFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const content = await file.text();
      const result = parseCSV(content);

      if (!result.success) {
        setCSVErrors(result.errors || []);
        setCSVPreview([]);
        return;
      }

      setCSVErrors([]);
      setCSVPreview(result.data || []);
      setShowCSVDialog(true);
    } catch (error) {
      toast({
        title: "Error reading file",
        description: "Failed to read the CSV file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleConfirmCSVUpload = async () => {
    try {
      setIsProcessing(true);
      let successCount = 0;
      let failCount = 0;

      for (const vacancy of csvPreview) {
        try {
          await createMutation.mutateAsync({
            title: vacancy.title,
            department: vacancy.department,
            location: vacancy.location,
            description: vacancy.description || "",
            requirements: vacancy.requirements || "",
            salary: vacancy.salary || "",
            status: vacancy.status || "draft",
          });
          successCount++;
        } catch {
          failCount++;
        }
      }

      setShowCSVDialog(false);
      setCSVPreview([]);
      setCSVErrors([]);

      toast({
        title: "Upload Complete",
        description: `Successfully created ${successCount} vacancies${
          failCount > 0 ? `. ${failCount} failed.` : "."
        }`,
      });

      // Refresh vacancies list
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload vacancies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCSVTemplate = () => {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "vacancy-template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vacancy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-vacancies-title">Vacancies</h1>
          <p className="text-sm text-muted-foreground">
            Manage job openings and track applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            data-testid="button-upload-csv"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Upload CSV"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVFileSelected}
            style={{ display: "none" }}
            data-testid="input-csv-file"
          />
          <Link href="/vacancies/new">
            <Button data-testid="button-add-vacancy">
              <Plus className="mr-2 h-4 w-4" />
              Add Vacancy
            </Button>
          </Link>
        </div>
      </div>

      {csvErrors.length > 0 && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">CSV Validation Errors</h3>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
            {csvErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
          <Button
            variant="link"
            size="sm"
            onClick={downloadCSVTemplate}
            className="mt-3"
            data-testid="button-download-template"
          >
            <Download className="mr-1 h-4 w-4" />
            Download CSV Template
          </Button>
        </div>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vacancies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-vacancies"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <VacanciesTableSkeleton />
          ) : filteredVacancies.length === 0 && vacancies.length === 0 ? (
            <EmptyState />
          ) : filteredVacancies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No vacancies match your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden sm:table-cell">Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">GHL Sync</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVacancies.map((vacancy) => (
                    <TableRow key={vacancy.id} data-testid={`row-vacancy-${vacancy.id}`}>
                      <TableCell>
                        <div className="flex flex-col">
                          <Link href={`/vacancies/${vacancy.id}`}>
                            <span className="font-medium hover:underline cursor-pointer">
                              {vacancy.title}
                            </span>
                          </Link>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {vacancy.department}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {vacancy.department}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {vacancy.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[vacancy.status] || ""}>
                          {vacancy.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {vacancy.ghlPipelineId ? (
                          <Badge variant="outline" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Synced
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not synced</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-testid={`button-vacancy-actions-${vacancy.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/vacancies/${vacancy.id}`}>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/candidates?vacancy=${vacancy.id}`}>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                View Candidates
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteId(vacancy.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vacancy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vacancy? This action cannot be undone.
              All associated candidates will remain but will no longer be linked to this vacancy.
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

      <Dialog open={showCSVDialog} onOpenChange={setShowCSVDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview CSV Data</DialogTitle>
            <DialogDescription>
              Review the vacancies to be created from your CSV file. Click "Confirm Upload" to create them.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>{csvPreview.length}</strong> vacancies ready to be created
              </p>
            </div>

            {csvPreview.length > 0 && (
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Title</th>
                      <th className="px-4 py-2 text-left font-medium">Department</th>
                      <th className="px-4 py-2 text-left font-medium">Location</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {csvPreview.map((row, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-4 py-2">{row.title}</td>
                        <td className="px-4 py-2">{row.department}</td>
                        <td className="px-4 py-2">{row.location}</td>
                        <td className="px-4 py-2">
                          <Badge>{row.status || "draft"}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCSVDialog(false)}
              data-testid="button-cancel-csv-upload"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCSVUpload}
              disabled={isProcessing}
              data-testid="button-confirm-csv-upload"
            >
              {isProcessing ? "Uploading..." : "Confirm Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
