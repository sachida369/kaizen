import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  Lock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  getConfig,
  saveConfig,
  resetConfig,
  resetToDefaults,
  setCustomEndpoint,
  removeCustomEndpoint,
  type AdminConfig,
} from "@/lib/adminConfig";

// Password protection constant - change this to your desired admin password
const ADMIN_PASSWORD = "admin123";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [customEndpointKey, setCustomEndpointKey] = useState("");
  const [customEndpointUrl, setCustomEndpointUrl] = useState("");

  // Load config on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      const loaded = getConfig();
      setConfig(loaded);
    }
  }, [isAuthenticated]);

  // Password login UI (shown when not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6" />
              <CardTitle>Admin Settings</CardTitle>
            </div>
            <CardDescription>Enter the admin password to access settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  data-testid="input-adminPassword"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-authenticate">
                Unlock Admin Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!config) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (key: keyof AdminConfig, value: string) => {
    if (typeof config[key] === "string") {
      setConfig({
        ...config,
        [key]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      saveConfig(config);
      toast({
        title: "Settings Saved",
        description: "Admin configuration has been saved to browser storage.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput("");
      toast({
        title: "Authenticated",
        description: "Access granted to Admin Settings.",
      });
    } else {
      toast({
        title: "Invalid Password",
        description: "The password you entered is incorrect.",
        variant: "destructive",
      });
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setConfig(null);
    setPasswordInput("");
    toast({
      title: "Logged Out",
      description: "You have been logged out from Admin Settings.",
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will clear all custom configuration and reload.")) {
      try {
        resetConfig();
        const loaded = getConfig();
        setConfig(loaded);
        toast({
          title: "Reset Complete",
          description: "Configuration has been reset to defaults.",
        });
        window.location.reload();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reset configuration.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRestoreDefaults = () => {
    if (
      confirm(
        "Are you sure? This will reset all settings to their default values from environment variables."
      )
    ) {
      try {
        resetToDefaults();
        const loaded = getConfig();
        setConfig(loaded);
        toast({
          title: "Defaults Restored",
          description: "All settings have been restored to defaults.",
        });
        window.location.reload();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to restore defaults.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddCustomEndpoint = () => {
    if (!customEndpointKey.trim() || !customEndpointUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter both key and URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCustomEndpoint(customEndpointKey, customEndpointUrl);
      setConfig({
        ...config,
        customEndpoints: {
          ...config.customEndpoints,
          [customEndpointKey]: customEndpointUrl,
        },
      });
      setCustomEndpointKey("");
      setCustomEndpointUrl("");
      toast({
        title: "Endpoint Added",
        description: `Custom endpoint "${customEndpointKey}" has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add custom endpoint.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCustomEndpoint = (key: string) => {
    try {
      removeCustomEndpoint(key);
      const updated = { ...config };
      delete updated.customEndpoints[key];
      setConfig(updated);
      toast({
        title: "Endpoint Removed",
        description: `Custom endpoint "${key}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove custom endpoint.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Value copied to clipboard.",
    });
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets({
      ...showSecrets,
      [key]: !showSecrets[key],
    });
  };

  const renderSecretInput = (label: string, key: string, value: string) => (
    <div key={key} className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          type={showSecrets[key] ? "text" : "password"}
          value={value}
          onChange={(e) => handleInputChange(key as keyof AdminConfig, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="flex-1"
          data-testid={`input-${key}`}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => toggleSecretVisibility(key)}
          data-testid={`button-toggle-${key}`}
        >
          {showSecrets[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => copyToClipboard(value)}
          data-testid={`button-copy-${key}`}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full overflow-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Admin Settings</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage backend service URLs and API keys. Settings are saved to browser storage and
              applied at runtime.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
            className="ml-4"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* Service URLs Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Service URLs
            </CardTitle>
            <CardDescription>Configure backend service endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Backend API Base URL</label>
              <Input
                value={config.backendApiUrl}
                onChange={(e) => handleInputChange("backendApiUrl", e.target.value)}
                placeholder="https://api.example.com"
                data-testid="input-backendApiUrl"
              />
              <p className="text-xs text-muted-foreground">
                Primary backend API endpoint (overrides VITE_API_URL)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Auth Service URL</label>
              <Input
                value={config.authServiceUrl}
                onChange={(e) => handleInputChange("authServiceUrl", e.target.value)}
                placeholder="https://auth.example.com"
                data-testid="input-authServiceUrl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">File Storage Service URL</label>
              <Input
                value={config.fileStorageUrl}
                onChange={(e) => handleInputChange("fileStorageUrl", e.target.value)}
                placeholder="https://storage.example.com"
                data-testid="input-fileStorageUrl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notification Service URL</label>
              <Input
                value={config.notificationServiceUrl}
                onChange={(e) => handleInputChange("notificationServiceUrl", e.target.value)}
                placeholder="https://notifications.example.com"
                data-testid="input-notificationServiceUrl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">WebSocket / FCM URL</label>
              <Input
                value={config.websocketFcmUrl}
                onChange={(e) => handleInputChange("websocketFcmUrl", e.target.value)}
                placeholder="wss://websocket.example.com"
                data-testid="input-websocketFcmUrl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Gateway URL</label>
              <Input
                value={config.paymentGatewayUrl}
                onChange={(e) => handleInputChange("paymentGatewayUrl", e.target.value)}
                placeholder="https://payments.example.com"
                data-testid="input-paymentGatewayUrl"
              />
            </div>
          </CardContent>
        </Card>

        {/* API Keys Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Sensitive credentials stored securely in browser storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderSecretInput("Public API Key", "publicApiKey", config.publicApiKey)}
            {renderSecretInput("Private Token", "privateToken", config.privateToken)}
            {renderSecretInput("Firebase Key", "firebaseKey", config.firebaseKey)}
            {renderSecretInput("Payment Key", "paymentKey", config.paymentKey)}
          </CardContent>
        </Card>

        {/* Custom Endpoints Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Custom API Endpoints
            </CardTitle>
            <CardDescription>Add custom or future API endpoints as needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Endpoint */}
            <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Endpoint Key</label>
                  <Input
                    value={customEndpointKey}
                    onChange={(e) => setCustomEndpointKey(e.target.value)}
                    placeholder="e.g., analytics-api"
                    data-testid="input-customEndpointKey"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={customEndpointUrl}
                    onChange={(e) => setCustomEndpointUrl(e.target.value)}
                    placeholder="https://analytics.example.com"
                    data-testid="input-customEndpointUrl"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddCustomEndpoint}
                size="sm"
                className="w-full md:w-auto"
                data-testid="button-addCustomEndpoint"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Endpoint
              </Button>
            </div>

            {/* List Existing Custom Endpoints */}
            {Object.keys(config.customEndpoints).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Registered Endpoints</h4>
                <div className="space-y-2">
                  {Object.entries(config.customEndpoints).map(([key, url]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                      data-testid={`item-customEndpoint-${key}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{key}</p>
                        <p className="text-xs text-muted-foreground truncate">{url}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(url)}
                          data-testid={`button-copyEndpoint-${key}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveCustomEndpoint(key)}
                          data-testid={`button-deleteEndpoint-${key}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end flex-wrap">
          <Button
            variant="outline"
            onClick={handleRestoreDefaults}
            data-testid="button-restoreDefaults"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restore Defaults
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            data-testid="button-resetConfig"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            data-testid="button-saveConfig"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Info:</strong> Settings are stored in your browser's localStorage and persisted
            across sessions. No data is sent to the server. These configurations override environment
            variables at runtime.
          </p>
        </div>
      </div>
    </div>
  );
}
