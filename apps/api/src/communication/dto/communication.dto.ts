import {
  AnnouncementPriority,
  ConversationType,
  ConversationVisibility,
  MeetingParticipantStatus,
  MeetingStatus,
  PresenceStatus,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class ListCommunicationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 25;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}

export class IdParamDto {
  @IsUUID()
  id!: string;
}

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsEnum(ConversationType)
  type!: ConversationType;

  @IsOptional()
  @IsEnum(ConversationVisibility)
  visibility?: ConversationVisibility;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  department?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID('4', { each: true })
  memberUserIds?: string[];
}

export class UpdateConversationDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(ConversationVisibility)
  visibility?: ConversationVisibility;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class CreateMessageDto {
  @IsUUID()
  conversationId!: string;

  @IsOptional()
  @IsUUID()
  threadId?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsString()
  @MaxLength(8000)
  content!: string;

  @IsOptional()
  @IsBoolean()
  markdown?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID('4', { each: true })
  mentions?: string[];
}

export class UpdateMessageDto {
  @IsString()
  @MaxLength(8000)
  content!: string;
}

export class ReactToMessageDto {
  @IsString()
  @MaxLength(32)
  emoji!: string;
}

export class CreateThreadDto {
  @IsUUID()
  conversationId!: string;

  @IsUUID()
  rootMessageId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;
}

export class CreateAnnouncementDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsString()
  @MaxLength(12000)
  body!: string;

  @IsOptional()
  @IsEnum(AnnouncementPriority)
  priority?: AnnouncementPriority;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  body?: string;

  @IsOptional()
  @IsEnum(AnnouncementPriority)
  priority?: AnnouncementPriority;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

class MeetingParticipantDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEnum(MeetingParticipantStatus)
  status?: MeetingParticipantStatus;
}

export class CreateMeetingDto {
  @IsString()
  @MaxLength(180)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  agenda?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  documentId?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeetingParticipantDto)
  participants?: MeetingParticipantDto[];
}

export class UpdateMeetingDto extends CreateMeetingDto {
  @IsOptional()
  declare title: string;

  @IsOptional()
  declare startsAt: string;

  @IsOptional()
  declare endsAt: string;
}

export class CreateMeetingNoteDto {
  @IsUUID()
  meetingId!: string;

  @IsString()
  @MaxLength(180)
  title!: string;

  @IsString()
  @MaxLength(20000)
  content!: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsUUID()
  documentId?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;
}

export class UpdateMeetingNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  content?: string;
}

export class UpdatePresenceDto {
  @IsEnum(PresenceStatus)
  presenceStatus!: PresenceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  presenceMessage?: string;

  @IsOptional()
  @IsUUID()
  currentProjectId?: string;
}
