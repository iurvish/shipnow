'use client';

import {
  memo,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { cn } from '@/lib/utils';
import type { DatabasePerson } from '@/lib/actions/chat-actions';
import { UserDetailSkeleton } from './user-details/user-detail-skeleton';
import { UserIcon, MailIcon, GithubIcon } from 'lucide-react';
import { useUserArtifact } from '@/hooks/use-user-artifact';
import equal from 'fast-deep-equal';

interface UserPreviewProps {
  isReadonly?: boolean;
  result?: {
    id: string;
    title: string;
    userData: DatabasePerson;
  };
  args?: {
    title: string;
    userData: DatabasePerson;
  };
}

export function UserPreview({
  isReadonly = false,
  result,
  args,
}: UserPreviewProps) {
  const { userArtifact, setUserArtifact } = useUserArtifact();

  const hitboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boundingBox = hitboxRef.current?.getBoundingClientRect();

    if (userArtifact.userId && boundingBox) {
      setUserArtifact((artifact) => ({
        ...artifact,
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      }));
    }
  }, [userArtifact.userId, setUserArtifact]);

  if (userArtifact.isVisible) {
    if (result) {
      return (
        <UserToolResult
          type="view"
          result={{ 
            id: result.id, 
            title: result.title, 
            userData: result.userData 
          }}
          isReadonly={isReadonly}
        />
      );
    }

    if (args) {
      return (
        <UserToolCall
          type="view"
          args={{ 
            title: args.title, 
            userData: args.userData 
          }}
          isReadonly={isReadonly}
        />
      );
    }
  }

  const userData = result?.userData || args?.userData;
  const title = result?.title || args?.title;

  if (!userData || !title) return <UserDetailSkeleton />;

  return (
    <div className="relative w-full cursor-pointer">
      <HitboxLayer
        hitboxRef={hitboxRef}
        result={result}
        args={args}
        setUserArtifact={setUserArtifact}
      />
      <UserHeader
        title={title}
        isStreaming={userArtifact.status === 'streaming'}
      />
      <UserContent userData={userData} />
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="w-full">
    <div className="p-4 border rounded-t-2xl flex flex-row gap-2 items-center justify-between dark:bg-muted h-[57px] dark:border-zinc-700 border-b-0">
      <div className="flex flex-row items-center gap-3">
        <div className="text-muted-foreground">
          <div className="animate-pulse rounded-md size-4 bg-muted-foreground/20" />
        </div>
        <div className="animate-pulse rounded-lg h-4 bg-muted-foreground/20 w-24" />
      </div>
    </div>
    <div className="overflow-y-scroll border rounded-b-2xl p-8 pt-4 bg-muted border-t-0 dark:border-zinc-700">
      <UserDetailSkeleton />
    </div>
  </div>
);

const PureHitboxLayer = ({
  hitboxRef,
  result,
  args,
  setUserArtifact,
}: {
  hitboxRef: React.RefObject<HTMLDivElement | null>;
  result?: {
    id: string;
    title: string;
    userData: DatabasePerson;
  };
  args?: {
    title: string;
    userData: DatabasePerson;
  };
  setUserArtifact: (
    updaterFn: ((currentArtifact: any) => any)
  ) => void;
}) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const boundingBox = event.currentTarget.getBoundingClientRect();

      const data = result || args;
      if (!data) return;

      setUserArtifact((artifact) => ({
        ...artifact,
        title: data.title,
        userId: result?.id || 'preview',
        userData: {
          id: result?.id || 'preview',
          first_name: data.userData.first_name,
          last_name: data.userData.last_name,
          email: data.userData.email,
          bio: data.userData.bio,
          personal_details: data.userData.personal_details,
          technical_profile: data.userData.technical_profile,
        },
        isVisible: true,
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      }));
    },
    [setUserArtifact, result, args],
  );

  return (
    <div
      className="size-full absolute top-0 left-0 rounded-xl z-10"
      ref={hitboxRef}
      onClick={handleClick}
      role="presentation"
      aria-hidden="true"
    >
      <div className="w-full p-4 flex justify-end items-center">
        <div className="absolute right-[9px] top-[13px] p-2 hover:dark:bg-zinc-700 rounded-md hover:bg-zinc-100">
          <UserIcon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

const HitboxLayer = memo(PureHitboxLayer, (prevProps, nextProps) => {
  if (!equal(prevProps.result, nextProps.result)) return false;
  if (!equal(prevProps.args, nextProps.args)) return false;
  return true;
});

const PureUserHeader = ({
  title,
  isStreaming,
}: {
  title: string;
  isStreaming: boolean;
}) => (
  <div className="p-4 border rounded-t-2xl flex flex-row gap-2 items-start sm:items-center justify-between dark:bg-muted border-b-0 dark:border-zinc-700">
    <div className="flex flex-row items-start sm:items-center gap-3">
      <div className="text-muted-foreground">
        {isStreaming ? (
          <div className="animate-spin">
            <UserIcon className="h-4 w-4" />
          </div>
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
      </div>
      <div className="-translate-y-1 sm:translate-y-0 font-medium">{title}</div>
    </div>
    <div className="w-8" />
  </div>
);

const UserHeader = memo(PureUserHeader, (prevProps, nextProps) => {
  if (prevProps.title !== nextProps.title) return false;
  if (prevProps.isStreaming !== nextProps.isStreaming) return false;
  return true;
});

const UserContent = ({ userData }: { userData: DatabasePerson }) => {
  const containerClassName = cn(
    'h-[257px] overflow-y-scroll border rounded-b-2xl dark:bg-muted border-t-0 dark:border-zinc-700',
    'p-4 sm:px-6 sm:py-4',
  );

  const displayName = userData.first_name && userData.last_name
    ? `${userData.first_name} ${userData.last_name}`
    : userData.first_name || userData.last_name || 'Unknown User';

  return (
    <div className={containerClassName}>
      <div className="space-y-4">
        {/* User Basic Info */}
        <div className="flex items-start gap-3">
          <UserIcon className="h-5 w-5 text-muted-foreground mt-1" />
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </div>

        {/* Bio */}
        {userData.bio && (
          <div className="text-sm text-muted-foreground">
            {userData.bio}
          </div>
        )}

        {/* Education */}
        {userData.personal_details && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Education</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{userData.personal_details.university}</p>
              <p>{userData.personal_details.department}</p>
              <p>{userData.personal_details.degree_level}</p>
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {userData.technical_profile && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Technical Profile</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Experience:</strong> {userData.technical_profile.experience}</p>
              
              {userData.technical_profile.skills.length > 0 && (
                <div>
                  <p className="font-medium">Skills:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userData.technical_profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-4 pt-2">
                {userData.technical_profile.github && (
                  <a
                    href={userData.technical_profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <GithubIcon className="h-3 w-3" />
                    <span className="text-xs">GitHub</span>
                  </a>
                )}
                {userData.technical_profile.portfolio && (
                  <a
                    href={userData.technical_profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <span className="text-xs">Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tool components for when panel is visible
interface UserToolResultProps {
  type: 'view';
  result: { id: string; title: string; userData: DatabasePerson };
  isReadonly: boolean;
}

function PureUserToolResult({
  type,
  result,
  isReadonly,
}: UserToolResultProps) {
  const { setUserArtifact } = useUserArtifact();

  return (
    <button
      type="button"
      className="bg-background cursor-pointer border py-2 px-3 rounded-xl w-fit flex flex-row gap-3 items-start"
      onClick={(event) => {
        if (isReadonly) {
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();

        const boundingBox = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };

        setUserArtifact({
          userId: result.id,
          kind: 'user-detail',
          userData: {
            id: result.id,
            firstName: result.userData.first_name,
            lastName: result.userData.last_name,
            email: result.userData.email,
            bio: result.userData.bio,
            personalDetails: result.userData.personal_details ? {
              university: result.userData.personal_details.university,
              department: result.userData.personal_details.department,
              degreeLevel: result.userData.personal_details.degree_level,
              dateOfBirth: result.userData.personal_details.date_of_birth,
            } : null,
            technicalProfile: result.userData.technical_profile,
          },
          title: result.title,
          isVisible: true,
          status: 'idle',
          boundingBox,
        });
      }}
    >
      <div className="text-muted-foreground mt-1">
        <UserIcon className="h-4 w-4" />
      </div>
      <div className="text-left">
        {`Viewing "${result.title}"`}
      </div>
    </button>
  );
}

export const UserToolResult = memo(PureUserToolResult, () => true);

interface UserToolCallProps {
  type: 'view';
  args: { title: string; userData: DatabasePerson };
  isReadonly: boolean;
}

function PureUserToolCall({
  type,
  args,
  isReadonly,
}: UserToolCallProps) {
  const { setUserArtifact } = useUserArtifact();

  return (
    <button
      type="button"
      className="cursor pointer w-fit border py-2 px-3 rounded-xl flex flex-row items-start justify-between gap-3"
      onClick={(event) => {
        if (isReadonly) {
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();

        const boundingBox = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };

        setUserArtifact((currentArtifact) => ({
          ...currentArtifact,
          isVisible: true,
          boundingBox,
        }));
      }}
    >
      <div className="flex flex-row gap-3 items-start">
        <div className="text-zinc-500 mt-1">
          <UserIcon className="h-4 w-4" />
        </div>

        <div className="text-left">
          {`Viewing user "${args.title}"`}
        </div>
      </div>

      <div className="animate-spin mt-1">
        <UserIcon className="h-4 w-4" />
      </div>
    </button>
  );
}

export const UserToolCall = memo(PureUserToolCall, () => true);
