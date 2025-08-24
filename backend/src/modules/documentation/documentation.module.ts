import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentationService } from './documentation.service';
import { DocumentationController } from './documentation.controller';

@Module({
  imports: [ConfigModule],
  controllers: [DocumentationController],
  providers: [DocumentationService],
  exports: [DocumentationService],
})
export class DocumentationModule implements OnModuleInit {
  constructor(private readonly documentationService: DocumentationService) {}

  async onModuleInit() {
    // Optional: Pre-generate documentation on startup
    if (process.env.NODE_ENV === 'development' && process.env.PRE_GENERATE_DOCS === 'true') {
      try {
        // Note: This would need access to the NestJS app instance
        // The actual generation would happen in main.ts
        console.log('📚 Documentation module initialized');
      } catch (error) {
        console.error('Failed to pre-generate documentation:', error);
      }
    }
  }
}
