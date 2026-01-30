export class CreateMessageDto {
  userId: string;
  subject: string;
  content: string;
  type?: string;
  recipientId?: string;
}

export class UpdateMessageDto {
  subject?: string;
  content?: string;
  status?: string;
}
