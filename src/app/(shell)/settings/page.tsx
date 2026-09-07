"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ORGANIZATION } from "@/data/constants";

export default function GeneralSettingsPage() {
  const [orgName, setOrgName] = useState(ORGANIZATION.name);
  const [requireMfa, setRequireMfa] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);

  return (
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Settings"
        subtitle="Organization profile, security, and notification preferences"
        actions={<Button onClick={() => toast.success("Settings saved")}>Save Changes</Button>}
      />

      <div className="grid grid-cols-1 gap-4 px-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-[14px]">Organization Profile</CardTitle>
            <CardDescription>Basic information about your organization.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="org-name">Organization name</Label>
              <Input id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Sector</Label>
                <Input value={ORGANIZATION.sector} disabled />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Plan</Label>
                <Input value={ORGANIZATION.plan} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-[14px]">Security</CardTitle>
            <CardDescription>Access control requirements for your organization.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="mfa">Require MFA for administrative actions</Label>
                <p className="mt-0.5 text-[11.5px] text-foreground-faint">Enforce multi-factor authentication for policy and credential changes.</p>
              </div>
              <Switch id="mfa" checked={requireMfa} onCheckedChange={setRequireMfa} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="timeout">30-minute idle session timeout</Label>
                <p className="mt-0.5 text-[11.5px] text-foreground-faint">Automatically sign out inactive analyst sessions.</p>
              </div>
              <Switch id="timeout" checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-[14px]">Notifications</CardTitle>
            <CardDescription>How the platform reaches your team about risk activity.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4 sm:flex-row sm:gap-8">
            <div className="flex flex-1 items-center justify-between gap-3">
              <div>
                <Label htmlFor="digest">Daily email digest</Label>
                <p className="mt-0.5 text-[11.5px] text-foreground-faint">Summary of alerts and risk activity, sent each morning.</p>
              </div>
              <Switch id="digest" checked={emailDigest} onCheckedChange={setEmailDigest} />
            </div>
            <div className="flex flex-1 items-center justify-between gap-3">
              <div>
                <Label htmlFor="sms">SMS for critical alerts</Label>
                <p className="mt-0.5 text-[11.5px] text-foreground-faint">Send an SMS to on-call analysts for critical severity events.</p>
              </div>
              <Switch id="sms" checked={criticalSms} onCheckedChange={setCriticalSms} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
