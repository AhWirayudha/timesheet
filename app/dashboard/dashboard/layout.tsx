'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity, Menu, FolderOpen, Mail, Plus } from 'lucide-react';

interface Invitation {
  id: number;
  status: string;
}

interface UserTeam {
  teamId: number | null;
  role: string | null;
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user team status and pending invitations
    const fetchUserData = async () => {
      try {
        const [invitationsResponse, userResponse] = await Promise.all([
          fetch('/api/invitations'),
          fetch('/api/user')
        ]);

        if (invitationsResponse.ok) {
          const invitationsData = await invitationsResponse.json();
          setPendingInvitations(invitationsData);
        }

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserTeam(userData.team);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Define navigation items based on user's team status
  const getNavItems = () => {
    const baseItems = [
      { href: '/dashboard/general', icon: Settings, label: 'General' },
      { href: '/dashboard/security', icon: Shield, label: 'Security' }
    ];

    if (userTeam?.teamId) {
      // User is part of a team - show team-related items
      return [
        { href: '/dashboard', icon: Users, label: 'Team' },
        { href: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
        { href: '/dashboard/activity', icon: Activity, label: 'Analytics' },
        { 
          href: '/dashboard/invitations', 
          icon: Mail, 
          label: 'Invitations',
          badge: pendingInvitations.length > 0 ? pendingInvitations.length : undefined
        },
        ...baseItems
      ];
    } else {
      // User is not part of a team - show create team option
      return [
        { href: '/dashboard/create-team', icon: Plus, label: 'Create Team' },
        { 
          href: '/dashboard/invitations', 
          icon: Mail, 
          label: 'Invitations',
          badge: pendingInvitations.length > 0 ? pendingInvitations.length : undefined
        },
        ...baseItems
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <span className="font-medium">Settings</span>
        </div>
        <Button
          className="-mr-3"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className={`shadow-none my-1 w-full justify-start relative ${
                      pathname === item.href ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              ))
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
