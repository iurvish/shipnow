import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, MapPin, GraduationCap, Mail, Phone } from 'lucide-react';
import { DatabasePerson } from '@/lib/actions/chat-actions';

interface DatabasePersonCardProps {
  person: DatabasePerson;
}

const getExperienceBadgeColor = (level: string) => {
  switch (level.toUpperCase()) {
    case 'BEGINNER':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'INTERMEDIATE':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ADVANCED':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDegreeLevelIcon = (level: string) => {
  switch (level.toUpperCase()) {
    case 'PHD':
      return '🎓';
    case 'GRADUATE':
      return '📚';
    case 'UNDERGRADUATE':
      return '📖';
    default:
      return '🎓';
  }
};

export function DatabasePersonCard({ person }: DatabasePersonCardProps) {
  const fullName = `${person.first_name} ${person.last_name}`;
  const skills = person.technical_profile?.primary_skills || [];
  const interests = person.technical_profile?.interests || [];

  return (
    <div 
      className="bg-card border border-border p-6 transition-all duration-200 hover:shadow-md hover:border-muted-foreground/20"
      style={{
        clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {fullName}
          </h3>
          {person.technical_profile?.preferred_roles && person.technical_profile.preferred_roles.length > 0 && (
            <p className="text-sm text-muted-foreground mb-2">
              {person.technical_profile.preferred_roles[0]}
            </p>
          )}
          {person.technical_profile?.experience_level && (
            <Badge 
              variant="outline" 
              className={`text-xs ${getExperienceBadgeColor(person.technical_profile.experience_level)}`}
              style={{ borderRadius: '0px' }}
            >
              {person.technical_profile.experience_level}
            </Badge>
          )}
        </div>
      </div>

      {/* Education Info */}
      {person.personal_details && (
        <div 
          className="mb-4 p-3 bg-muted/30 border border-muted" 
          style={{ 
            clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {getDegreeLevelIcon(person.personal_details.degree_level)} {person.personal_details.degree_level}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {person.personal_details.department} at {person.personal_details.university}
          </p>
        </div>
      )}

      {/* Bio */}
      {person.bio && (
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {person.bio}
        </p>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-foreground">Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 6).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1 bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-muted"
                style={{ borderRadius: '0px' }}
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 6 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-1"
                style={{ borderRadius: '0px' }}
              >
                +{skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-foreground">Interests</h4>
          <div className="flex flex-wrap gap-1.5">
            {interests.slice(0, 4).map((interest, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-1 border-muted-foreground/30"
                style={{ borderRadius: '0px' }}
              >
                {interest}
              </Badge>
            ))}
            {interests.length > 4 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-1"
                style={{ borderRadius: '0px' }}
              >
                +{interests.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span className="truncate">{person.email}</span>
        </div>
        {person.personal_details?.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{person.personal_details.phone}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-muted-foreground/20 hover:bg-muted"
          style={{ 
            clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
          }}
        >
          Contact
        </Button>
        
        {/* Social Links */}
        <div className="flex gap-1">
          {person.technical_profile?.github_url && (
            <Button
              variant="outline"
              size="sm"
              className="p-2 border-muted-foreground/20 hover:bg-muted"
              style={{ 
                clipPath: 'polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)',
              }}
              asChild
            >
              <a href={person.technical_profile.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {person.technical_profile?.linkedin_url && (
            <Button
              variant="outline"
              size="sm"
              className="p-2 border-muted-foreground/20 hover:bg-muted"
              style={{ 
                clipPath: 'polygon(2px 0%, 100% 0%, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0% 100%, 0% 2px)',
              }}
              asChild
            >
              <a href={person.technical_profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
