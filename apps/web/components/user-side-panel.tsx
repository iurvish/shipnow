'use client';

import { useEffect, useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserIcon, MailIcon, GithubIcon, ExternalLinkIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserArtifact } from '@/hooks/use-user-artifact';
import { UserDetailSkeleton } from './user-detail-skeleton';
import { Button } from '@/components/ui/button';

export function UserDetailPanel() {
  const { userArtifact, setUserArtifact } = useUserArtifact();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (userArtifact.isVisible) {
      setIsVisible(true);
    }
  }, [userArtifact.isVisible]);

  const handleClose = () => {
    setUserArtifact((artifact) => ({
      ...artifact,
      isVisible: false,
    }));
    
    // Delay hiding the panel to allow for animation
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible && !userArtifact.isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {userArtifact.isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />

          {/* Side Panel */}
          <motion.div
            ref={panelRef}
            initial={{
              x: '100%',
              ...(userArtifact.boundingBox && {
                width: userArtifact.boundingBox.width,
                height: userArtifact.boundingBox.height,
                top: userArtifact.boundingBox.top,
                left: userArtifact.boundingBox.left,
              }),
            }}
            animate={{
              x: 0,
              width: 448, // w-112 = 28rem = 448px
              height: '100vh',
              top: 0,
              right: 0,
              left: 'auto',
            }}
            exit={{
              x: '100%',
              ...(userArtifact.boundingBox && {
                width: userArtifact.boundingBox.width,
                height: userArtifact.boundingBox.height,
                top: userArtifact.boundingBox.top,
                left: userArtifact.boundingBox.left,
              }),
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: 0.3,
            }}
            className="fixed z-50 bg-background border-l border-border overflow-hidden"
            style={{
              maxWidth: '90vw',
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-medium truncate">
                    {userArtifact.title || 'User Details'}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {userArtifact.status === 'streaming' || !userArtifact.userData ? (
                  <div className="p-6">
                    <UserDetailSkeleton />
                  </div>
                ) : (
                  <UserDetailContent userData={userArtifact.userData} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface UserDetailContentProps {
  userData: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    bio: string | null;
    personalDetails: {
      university: string;
      department: string;
      degreeLevel: string;
      dateOfBirth: string | null;
    } | null;
    technicalProfile: {
      skills: string[];
      experience: string;
      github: string | null;
      portfolio: string | null;
    } | null;
  };
}

const UserDetailContent = memo(({ userData }: UserDetailContentProps) => {
  const displayName = userData.firstName && userData.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : userData.firstName || userData.lastName || 'Unknown User';

  const canSendEmail = userData.email && userData.email.includes('@');

  return (
    <div className="p-6 space-y-6">
      {/* User Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground mb-1">
              {displayName}
            </h1>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </div>

        {/* Bio */}
        {userData.bio && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            {userData.bio}
          </div>
        )}
      </div>

      {/* Contact Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={!canSendEmail}
          onClick={() => {
            if (canSendEmail) {
              window.open(`mailto:${userData.email}`, '_blank');
            }
          }}
          className="flex items-center gap-2"
        >
          <MailIcon className="h-3 w-3" />
          Email
        </Button>
        
        {userData.technicalProfile?.github && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (userData.technicalProfile?.github) {
                window.open(userData.technicalProfile.github, '_blank');
              }
            }}
            className="flex items-center gap-2"
          >
            <GithubIcon className="h-3 w-3" />
            GitHub
          </Button>
        )}
        
        {userData.technicalProfile?.portfolio && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (userData.technicalProfile?.portfolio) {
                window.open(userData.technicalProfile.portfolio, '_blank');
              }
            }}
            className="flex items-center gap-2"
          >
            <ExternalLinkIcon className="h-3 w-3" />
            Portfolio
          </Button>
        )}
      </div>

      {/* Education Section */}
      {userData.personalDetails && (
        <div className="space-y-3">
          <h3 className="text-base font-medium text-foreground">Education</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{userData.personalDetails.university}</span>
            </div>
            <div className="ml-6 space-y-1 text-muted-foreground">
              <p>{userData.personalDetails.department}</p>
              <p>{userData.personalDetails.degreeLevel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Profile Section */}
      {userData.technicalProfile && (
        <div className="space-y-4">
          <h3 className="text-base font-medium text-foreground">Technical Profile</h3>
          
          {/* Experience Level */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Experience Level</h4>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {userData.technicalProfile.experience}
            </div>
          </div>

          {/* Skills */}
          {userData.technicalProfile.skills.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {userData.technicalProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {(userData.technicalProfile.github || userData.technicalProfile.portfolio) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Links</h4>
              <div className="space-y-2">
                {userData.technicalProfile.github && (
                  <a
                    href={userData.technicalProfile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GitHub Profile</span>
                    <ExternalLinkIcon className="h-3 w-3" />
                  </a>
                )}
                {userData.technicalProfile.portfolio && (
                  <a
                    href={userData.technicalProfile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span>Portfolio Website</span>
                    <ExternalLinkIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Additional Info */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          User ID: {userData.id}
        </p>
      </div>
    </div>
  );
});
