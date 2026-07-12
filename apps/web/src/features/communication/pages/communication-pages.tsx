import { Link, useParams } from 'react-router';
import {
  Bell,
  Bot,
  CalendarClock,
  CheckCircle2,
  Hash,
  Megaphone,
  MessageSquareText,
  Paperclip,
  Radio,
  Search,
  Send,
  UsersRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  useAnnouncements,
  useCommunicationCapabilities,
  useConversations,
  useCreateConversation,
  useCreateMessage,
  useMeeting,
  useMeetingNotes,
  useMeetings,
  useMessages,
  usePresence,
  useUpdatePresence,
} from '../hooks/use-communication';

const communicationSubnav: Array<{ to: string; label: string }> = [
  { to: '/app/chat', label: 'Chat' },
  { to: '/app/channels', label: 'Channels' },
  { to: '/app/announcements', label: 'Announcements' },
  { to: '/app/meetings', label: 'Meetings' },
  { to: '/app/meeting-notes', label: 'Notes' },
  { to: '/app/presence', label: 'Presence' },
];

function items<T>(data?: { items: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

function CommunicationShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Workspace / Communication</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {communicationSubnav.map(({ to, label }) => (
            <Link key={to} to={to}>
              <Button variant="outline" size="sm">
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <section className="premium-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-secondary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{hint}</p>
    </section>
  );
}

export function ChatPage() {
  const conversations = useConversations({ pageSize: 20 });
  const capabilities = useCommunicationCapabilities();
  const createConversation = useCreateConversation();
  const createDemo = () =>
    createConversation.mutate({
      type: 'CHANNEL',
      name: `Operations room ${Date.now().toString().slice(-4)}`,
      memberUserIds: [],
    });

  return (
    <CommunicationShell
      title="Communication mission control"
      description="Direct messages, channels, threads, announcements, meetings, and AI-ready operational knowledge."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Conversations"
          value={items(conversations.data).length}
          hint="Channels, DMs, groups, and announcement rooms."
          icon={MessageSquareText}
        />
        <StatCard
          label="Realtime"
          value="Ready"
          hint={capabilities.data?.realtime.websocketNamespace ?? 'communication namespace'}
          icon={Radio}
        />
        <StatCard
          label="AI prep"
          value="Prepared"
          hint="Summaries, search, embeddings, and knowledge links are scaffolded."
          icon={Bot}
        />
        <StatCard
          label="Notifications"
          value="In-app"
          hint="Mentions, announcements, and meeting invites are architecture-ready."
          icon={Bell}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <section className="premium-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent conversations</h2>
            <Button size="sm" onClick={createDemo}>
              New
            </Button>
          </div>
          <div className="mt-4 grid gap-2">
            {items(conversations.data).map((conversation) => (
              <Link
                key={conversation.id}
                to={`/app/chat/${conversation.id}`}
                className="rounded-md border p-3 text-sm transition hover:bg-accent"
              >
                <span className="font-medium">{conversation.name ?? conversation.type}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {conversation.visibility} · {conversation._count?.messages ?? 0} messages
                </span>
              </Link>
            ))}
            {!items(conversations.data).length && (
              <p className="rounded-md border p-4 text-sm text-muted-foreground">
                No conversations yet. Create a channel to start collecting operational context.
              </p>
            )}
          </div>
        </section>

        <section className="premium-card p-5">
          <div className="flex items-center gap-3">
            <span className="ai-breathing grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Send className="size-4" />
            </span>
            <div>
              <h2 className="font-semibold">Collaboration stream</h2>
              <p className="text-sm text-muted-foreground">
                Message streaming, mentions, reactions, read receipts, attachments, and pinned
                messages are wired through the backend contract.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {['Markdown messages', 'Thread replies', 'Typing indicators', 'Read receipts'].map(
              (feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-md border p-3 text-sm"
                >
                  <CheckCircle2 className="size-4" />
                  {feature}
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </CommunicationShell>
  );
}

export function ConversationPage() {
  const { conversationId } = useParams();
  const messages = useMessages(conversationId);
  const createMessage = useCreateMessage();
  const sendDemo = () => {
    if (!conversationId) return;
    createMessage.mutate({
      conversationId,
      content: `Milestone 8 message ${new Date().toLocaleTimeString()}`,
    });
  };

  return (
    <CommunicationShell
      title="Conversation"
      description="Messages become searchable, thread-aware operational knowledge."
    >
      <section className="premium-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Message stream</h2>
          <Button onClick={sendDemo}>
            <Send className="mr-2 size-4" />
            Send test message
          </Button>
        </div>
        <div className="mt-5 grid gap-3">
          {items(messages.data).map((message) => (
            <article key={message.id} className="rounded-md border bg-background/70 p-4">
              <p className="text-sm font-medium">{message.author?.name ?? 'Team member'}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{message.content}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Markdown</span>
                <span>Replies prepared</span>
                <span>Reactions {message.reactions?.length ?? 0}</span>
              </div>
            </article>
          ))}
          {!items(messages.data).length && (
            <p className="rounded-md border p-6 text-sm text-muted-foreground">
              No messages yet. The stream is ready for messages, attachments, reactions, and
              threads.
            </p>
          )}
        </div>
      </section>
    </CommunicationShell>
  );
}

export function ChannelsPage() {
  const conversations = useConversations({ pageSize: 50 });
  const channels = items(conversations.data).filter(
    (conversation) => conversation.type === 'CHANNEL',
  );

  return (
    <CommunicationShell
      title="Channels"
      description="Public, private, department, project, and company-wide rooms with archive and restore architecture."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => (
          <Link key={channel.id} to={`/app/chat/${channel.id}`} className="premium-card p-5">
            <Hash className="size-4" />
            <h2 className="mt-3 font-semibold">{channel.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {channel.visibility} · {channel.isArchived ? 'Archived' : 'Active'}
            </p>
          </Link>
        ))}
      </div>
    </CommunicationShell>
  );
}

export function AnnouncementsPage() {
  const announcements = useAnnouncements({ pageSize: 20 });

  return (
    <CommunicationShell
      title="Announcements"
      description="Company-wide announcements with priority, pinning, expiry, delivery, and acknowledgement architecture."
    >
      <div className="grid gap-4">
        {items(announcements.data).map((announcement) => (
          <article key={announcement.id} className="premium-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {announcement.priority}
                </p>
                <h2 className="mt-2 font-semibold">{announcement.title}</h2>
              </div>
              <Megaphone className="size-5" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{announcement.body}</p>
          </article>
        ))}
      </div>
    </CommunicationShell>
  );
}

export function MeetingsPage() {
  const meetings = useMeetings({ pageSize: 20 });

  return (
    <CommunicationShell
      title="Meetings"
      description="Upcoming meetings, agendas, notes, action items, recording placeholders, and AI meeting preparation."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items(meetings.data).map((meeting) => (
          <Link key={meeting.id} to={`/app/meetings/${meeting.id}`} className="premium-card p-5">
            <CalendarClock className="size-5" />
            <h2 className="mt-3 font-semibold">{meeting.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {new Date(meeting.startsAt).toLocaleString()} · {meeting.status}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              AI summary and action extraction prepared.
            </p>
          </Link>
        ))}
      </div>
    </CommunicationShell>
  );
}

export function MeetingDetailPage() {
  const { id } = useParams();
  const meeting = useMeeting(id);

  return (
    <CommunicationShell
      title={meeting.data?.title ?? 'Meeting'}
      description="Agenda, participants, notes, linked work, recording placeholder, and AI summary architecture."
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <section className="premium-card p-5">
          <h2 className="font-semibold">Agenda</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {meeting.data?.agenda ?? 'No agenda yet.'}
          </p>
          <div className="mt-5 rounded-md border p-4">
            <h3 className="font-medium">AI Summary placeholder</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Summary generation is prepared but not implemented in this milestone.
            </p>
          </div>
        </section>
        <aside className="grid gap-4">
          <section className="premium-card p-5">
            <h2 className="font-semibold">Participants</h2>
            <div className="mt-3 grid gap-2">
              {(meeting.data?.participants ?? []).map((participant) => (
                <div key={participant.id} className="rounded-md border p-3 text-sm">
                  {participant.name ?? participant.email ?? 'Participant'} · {participant.status}
                </div>
              ))}
            </div>
          </section>
          <section className="premium-card p-5">
            <h2 className="font-semibold">Linked knowledge</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Projects, CRM, documents, tasks, recordings, and action items are linked in the
              backend.
            </p>
          </section>
        </aside>
      </div>
    </CommunicationShell>
  );
}

export function MeetingNotesPage() {
  const notes = useMeetingNotes();

  return (
    <CommunicationShell
      title="Meeting notes"
      description="Markdown notes linked to meetings, documents, CRM, projects, tasks, and future AI summaries."
    >
      <div className="grid gap-4">
        {items(notes.data).map((note) => (
          <article key={note.id} className="premium-card p-5">
            <h2 className="font-semibold">{note.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{note.meeting?.title}</p>
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {note.content}
            </p>
          </article>
        ))}
      </div>
    </CommunicationShell>
  );
}

export function PresencePage() {
  const presence = usePresence();
  const updatePresence = useUpdatePresence();

  return (
    <CommunicationShell
      title="Presence"
      description="Online, away, busy, offline, in meeting, working on project, and future AI status suggestions."
    >
      <div className="flex flex-wrap gap-2">
        {['ONLINE', 'AWAY', 'BUSY', 'IN_MEETING', 'WORKING_ON_PROJECT'].map((status) => (
          <Button
            key={status}
            variant="outline"
            onClick={() => updatePresence.mutate({ presenceStatus: status })}
          >
            {status.replaceAll('_', ' ')}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items(presence.data).map((record) => (
          <section key={record.id} className="premium-card p-5">
            <UsersRound className="size-4" />
            <h2 className="mt-3 font-semibold">{record.user?.name ?? 'User'}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {record.presenceStatus.replaceAll('_', ' ')}
            </p>
            {record.presenceMessage ? (
              <p className="mt-2 text-sm text-muted-foreground">{record.presenceMessage}</p>
            ) : null}
          </section>
        ))}
      </div>
    </CommunicationShell>
  );
}

export function CommunicationSearchPlaceholder() {
  return (
    <CommunicationShell
      title="Communication search"
      description="Keyword search is ready; semantic search and AI answers are prepared for the knowledge graph."
    >
      <section className="premium-card p-5">
        <Search className="size-5" />
        <h2 className="mt-3 font-semibold">Search architecture prepared</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Messages, meetings, notes, announcements, attachments, mentions, and linked records will
          become searchable business memory.
        </p>
      </section>
    </CommunicationShell>
  );
}

export function AttachmentsPlaceholder() {
  return (
    <CommunicationShell
      title="Attachments"
      description="File sharing is backed by attachment models and prepared validation."
    >
      <section className="premium-card p-5">
        <Paperclip className="size-5" />
        <h2 className="mt-3 font-semibold">Attachment architecture prepared</h2>
      </section>
    </CommunicationShell>
  );
}
