'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  UserPlus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { createTeam, inviteTeamMember, removeTeamMember } from '@/app/login/actions';
import { useRouter } from 'next/navigation';

interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
  role: string;
  joinedAt: string;
  user: {
    id: number;
    name?: string;
    email: string;
  };
}

interface Team {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  teamMembers?: TeamMember[];
}

interface Invitation {
  id: number;
  teamId: number;
  email: string;
  role: string;
  invitedAt: string;
  status: string;
  invitedBy: {
    id: number;
    name?: string;
    email: string;
  };
}

export default function TeamsPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'member'
  });
  const [editData, setEditData] = useState({
    name: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      // Fetch user team info
      const userResponse = await fetch('/api/user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.team?.teamId) {
          setUserRole(userData.team.role);
        }
      }

      // Fetch team data
      const teamResponse = await fetch('/api/team');
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeam(teamData);
        setEditData({
          name: teamData.name || ''
        });
      }

      // Fetch invitations
      const invitationsResponse = await fetch('/api/invitations');
      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setInvitations(invitationsData);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      
      const result = await createTeam({}, formDataObj);
      
      if (result?.error) {
        setError(result.error);
      } else if ('success' in result && result.success) {
        setSuccess('Team created successfully!');
        setIsCreating(false);
        setShowCreateModal(false);
        setFormData({ name: '' });
        fetchTeamData();
        setTimeout(() => {
          router.push('/dashboard/teams');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setError('Failed to create team');
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append('email', inviteData.email);
      formDataObj.append('role', inviteData.role);
      
      const result = await inviteTeamMember({}, formDataObj);
      
      if (result?.error) {
        setError(result.error);
      } else if ('success' in result && result.success) {
        setSuccess('Invitation sent successfully!');
        setIsInviting(false);
        setInviteData({ email: '', role: 'member' });
        fetchTeamData();
      }
    } catch (error) {
      console.error('Error inviting member:', error);
      setError('Failed to send invitation');
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append('memberId', memberId.toString());
      
      const result = await removeTeamMember({}, formDataObj);
      
      if (result?.error) {
        setError(result.error);
      } else if ('success' in result && result.success) {
        setSuccess('Member removed successfully!');
        fetchTeamData();
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setError('Failed to remove member');
    }
  };

  const handleUpdateTeam = async () => {
    try {
      const response = await fetch('/api/team/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update team');
      }

      setSuccess('Team updated successfully!');
      setIsEditing(false);
      fetchTeamData();
    } catch (error) {
      console.error('Error updating team:', error);
      setError('Failed to update team');
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invitationId }),
      });

      if (response.ok) {
        setSuccess('Invitation accepted successfully! You are now a team member.');
        fetchTeamData();
        setTimeout(() => {
          router.push('/dashboard/teams');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Failed to accept invitation');
    }
  };

  const handleDeclineInvitation = async (invitationId: number) => {
    try {
      const response = await fetch(`/api/invitations?invitationId=${invitationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Invitation declined successfully');
        fetchTeamData();
      } else {
        setError('Failed to decline invitation');
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
      setError('Failed to decline invitation');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  // If user doesn't have a team, show create team option
  if (!team) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your team</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {!isCreating ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Create Your Team</CardTitle>
              <p className="text-muted-foreground">
                Start collaborating with your team members
              </p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsCreating(true)} 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <Label htmlFor="name">Team Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter team name"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Create Team
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            As a team owner, you'll be able to:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Create and manage projects</li>
            <li>• Invite team members</li>
            <li>• Manage team settings</li>
            <li>• Access team analytics</li>
          </ul>
        </div>
      </div>
    );
  }

  const isOwner = userRole === 'owner';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage your team and members</p>
        </div>
        {!isOwner && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            Only team owners can modify settings
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Information
                </CardTitle>
                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Team Name</Label>
                    <Input
                      id="editName"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Enter team name"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateTeam} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                                 <div className="space-y-4">
                   <div>
                     <h3 className="font-medium">{team.name}</h3>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                       <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                       <span>•</span>
                       <span>Updated {new Date(team.updatedAt).toLocaleDateString()}</span>
                     </div>
                   </div>

                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Users className="h-4 w-4" />
                     <span>{team.teamMembers?.length || 0} team members</span>
                   </div>
                 </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members ({team.teamMembers?.length || 0})
                </CardTitle>
                {isOwner && (
                  <Button
                    size="sm"
                    onClick={() => setIsInviting(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isInviting && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <form onSubmit={handleInviteMember} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inviteData.email}
                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                        placeholder="colleague@company.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={inviteData.role}
                        onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsInviting(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {team.teamMembers?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.user.name ? member.user.name[0] : member.user.email[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.user.name || member.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">{member.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'owner' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role === 'owner' && <Crown className="h-3 w-3 inline mr-1" />}
                        {member.role}
                      </span>
                      {isOwner && member.role !== 'owner' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{invitation.email}</p>
                        <span className="text-xs text-muted-foreground capitalize">
                          {invitation.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Invited by {invitation.invitedBy.name || invitation.invitedBy.email}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {new Date(invitation.invitedAt).toLocaleDateString()}
                      </p>
                                             <div className="flex gap-2">
                         <Button 
                           size="sm" 
                           className="flex-1"
                           onClick={() => handleAcceptInvitation(invitation.id)}
                         >
                           <CheckCircle className="h-3 w-3 mr-1" />
                           Accept
                         </Button>
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => handleDeclineInvitation(invitation.id)}
                           className="text-red-600"
                         >
                           <X className="h-3 w-3" />
                         </Button>
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Team Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Members:</span>
                <span className="font-medium">{team.teamMembers?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Owners:</span>
                <span className="font-medium">
                  {team.teamMembers?.filter(m => m.role === 'owner').length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Members:</span>
                <span className="font-medium">
                  {team.teamMembers?.filter(m => m.role === 'member').length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending Invites:</span>
                <span className="font-medium">{invitations.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Team
              </Button>
              {isOwner && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => router.push('/dashboard/general')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Team Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => router.push('/dashboard/activity')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Team Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => router.push('/dashboard/projects')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Projects
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create New Team</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ name: '' });
                  setError(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <Label htmlFor="modalName">Team Name *</Label>
                <Input
                  id="modalName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter team name"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Create Team
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '' });
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 