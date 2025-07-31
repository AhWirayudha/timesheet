'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { useActionState } from 'react';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import { removeTeamMember, inviteTeamMember } from '@/app/login/actions';
import useSWR from 'swr';
import { Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Mail, Users, FolderOpen, TrendingUp, Calendar, Settings, Crown } from 'lucide-react';
import Link from 'next/link';

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function TeamOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="h-[120px]">
          <CardHeader className="pb-2">
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function TeamOverview() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const { data: projects } = useSWR<any[]>('/api/projects?teamId=' + (teamData?.id || ''), fetcher);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  
  const isOwner = user?.role === 'owner' || teamData?.teamMembers?.some(m => m.user.id === user?.id && m.role === 'owner');

  if (!teamData) return null;

  const memberCount = teamData.teamMembers?.length || 0;
  const projectCount = projects?.length || 0;
  const ownerCount = teamData.teamMembers?.filter(m => m.role === 'owner').length || 0;
  const memberCountWithoutOwners = memberCount - ownerCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{memberCount}</div>
          <p className="text-xs text-muted-foreground">
            {memberCountWithoutOwners} members, {ownerCount} owners
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectCount}</div>
          <p className="text-xs text-muted-foreground">
            {projectCount > 0 ? 'Active projects' : 'No projects yet'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Health</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {projectCount > 0 && memberCount > 1 ? 'Good' : 'Setup'}
          </div>
          <p className="text-xs text-muted-foreground">
            {projectCount > 0 && memberCount > 1 ? 'Team is active' : 'Complete setup'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {teamData.teamMembers?.filter(m => {
              const joined = new Date(m.joinedAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return joined > weekAgo;
            }).length || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            New members this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamMembersSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4 mt-1">
          <div className="flex items-center space-x-4">
            <div className="size-8 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-14 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, {});

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => {
    return user.name || user.email || 'Unknown User';
  };

  const isOwner = user?.role === 'owner' || teamData?.teamMembers?.some(m => m.user.id === user?.id && m.role === 'owner');
  const currentUser = teamData?.teamMembers?.find(m => m.user.id === user?.id);

  if (!teamData?.teamMembers?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No team members yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          {isOwner && (
            <Button asChild size="sm">
              <Link href="/dashboard/projects">
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Projects
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {getUserDisplayName(member.user)}
                    </p>
                    {member.role === 'owner' && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {member.role} • {member.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && member.user.id !== user?.id && member.role !== 'owner' && (
                  <form action={removeAction}>
                    <input type="hidden" name="memberId" value={member.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={isRemovePending}
                    >
                      {isRemovePending ? 'Removing...' : 'Remove'}
                    </Button>
                  </form>
                )}
                {member.user.id === user?.id && (
                  <span className="text-xs text-muted-foreground">You</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        {removeState?.error && (
          <p className="text-red-500 mt-4">{removeState.error}</p>
        )}
      </CardContent>
    </Card>
  );
}

function InviteTeamMemberSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
    </Card>
  );
}

function InviteTeamMember() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const isOwner = user?.role === 'owner' || teamData?.teamMembers?.some(m => m.user.id === user?.id && m.role === 'owner');
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
              disabled={!isOwner}
            />
          </div>
          <div>
            <Label>Role</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Member</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && (
            <p className="text-red-500">{inviteState.error}</p>
          )}
          {inviteState?.success && (
            <p className="text-green-500">{inviteState.success}</p>
          )}
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Only team owners can send invitations to new members.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

function QuickActions() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const isOwner = user?.role === 'owner' || teamData?.teamMembers?.some(m => m.user.id === user?.id && m.role === 'owner');

  if (!isOwner) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild className="h-auto p-4 flex flex-col items-start">
            <Link href="/dashboard/projects">
              <FolderOpen className="h-6 w-6 mb-2" />
              <span className="font-medium">Create Project</span>
              <span className="text-sm text-muted-foreground">Start a new project</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
            <Link href="/dashboard/invitations">
              <Mail className="h-6 w-6 mb-2" />
              <span className="font-medium">Manage Invitations</span>
              <span className="text-sm text-muted-foreground">View pending invites</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
            <Link href="/dashboard/activity">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="font-medium">Team Analytics</span>
              <span className="text-sm text-muted-foreground">View team activity</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { data: userTeam } = useSWR<{ team: { teamId: number | null; role: string | null } }>('/api/user', fetcher);

  if (!userTeam?.team?.teamId) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <h1 className="text-lg lg:text-2xl font-medium mb-6">Welcome to Your Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You're currently using the app as a standalone user. To access team features and collaborate with others, you can:
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <PlusCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Create Your Own Team</p>
                  <p className="text-sm text-muted-foreground">
                    Start a new team and invite members to collaborate
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Join an Existing Team</p>
                  <p className="text-sm text-muted-foreground">
                    Accept invitations from team owners
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex space-x-2">
              <Button asChild>
                <Link href="/dashboard/create-team">Create Team</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/invitations">Check Invitations</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-lg lg:text-2xl font-medium">Team Dashboard</h1>
        <p className="text-muted-foreground">Manage your team, projects, and members</p>
      </div>
      
      <Suspense fallback={<TeamOverviewSkeleton />}>
        <TeamOverview />
      </Suspense>
      
      <Suspense fallback={<QuickActions />}>
        <QuickActions />
      </Suspense>
      
      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembers />
      </Suspense>
      
      <Suspense fallback={<InviteTeamMemberSkeleton />}>
        <InviteTeamMember />
      </Suspense>
    </section>
  );
}
