'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, UserIcon, MailIcon, GithubIcon, ExternalLinkIcon, MapPinIcon } from 'lucide-react';
import { useUserArtifact } from '@/hooks/use-user-artifact';
import { Button } from '@/components/ui/button';

export function UserArtifactPanel() {
  const { userArtifact, setUserArtifact } = useUserArtifact();

  const handleClose = useCallback(() => {
    setUserArtifact((artifact) => ({
      ...artifact,
      isVisible: false,
    }));
  }, [setUserArtifact]);

  if (!userArtifact.isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ 
        width: 0,
        opacity: 0
      }}
      animate={{ 
        width: 448, // 28rem - fixed width like Vercel
        opacity: 1
      }}
      exit={{ 
        width: 0,
        opacity: 0
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300
      }}
      className="bg-background border-l border-border h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">{userArtifact.title || 'User Profile'}</h3>
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
      <div className="flex-1 overflow-y-auto p-6">
        {userArtifact.userData ? (
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-1">
                {userArtifact.userData.firstName && userArtifact.userData.lastName
                  ? `${userArtifact.userData.firstName} ${userArtifact.userData.lastName}`
                  : userArtifact.userData.firstName || userArtifact.userData.lastName || 'Unknown User'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {userArtifact.userData.email}
              </p>
              
              {/* Send Email Button */}
              <Button variant="default" className="w-full" size="sm">
                <MailIcon className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>

            {/* Bio */}
            {userArtifact.userData.bio && (
              <div>
                <h3 className="font-medium text-sm mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {userArtifact.userData.bio}
                </p>
              </div>
            )}

            {/* Education */}
            {userArtifact.userData.personalDetails && (
              <div>
                <h3 className="font-medium text-sm mb-3">Education</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">{userArtifact.userData.personalDetails.university}</p>
                      <p className="text-muted-foreground">{userArtifact.userData.personalDetails.department}</p>
                      <p className="text-muted-foreground">{userArtifact.userData.personalDetails.degreeLevel}</p>
                      {userArtifact.userData.personalDetails.dateOfBirth && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Born: {new Date(userArtifact.userData.personalDetails.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Profile */}
            {userArtifact.userData.technicalProfile && (
              <div>
                <h3 className="font-medium text-sm mb-3">Technical Profile</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Experience Level: {userArtifact.userData.technicalProfile.experience}
                    </p>
                  </div>

                  {/* Skills */}
                  {userArtifact.userData.technicalProfile.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {userArtifact.userData.technicalProfile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GitHub Link */}
                  {userArtifact.userData.technicalProfile.github && (
                    <div>
                      <Button variant="outline" className="w-full" size="sm">
                        <GithubIcon className="h-4 w-4 mr-2" />
                        View GitHub Profile
                        <ExternalLinkIcon className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                  )}

                  {/* Portfolio */}
                  {userArtifact.userData.technicalProfile.portfolio && (
                    <div>
                      <Button variant="outline" className="w-full" size="sm">
                        <ExternalLinkIcon className="h-4 w-4 mr-2" />
                        View Portfolio
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile ID */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Profile ID: {userArtifact.userData.id}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No user data available
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
