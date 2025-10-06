// Unified Media System - Main Export File

// Context
export { 
  UnifiedMediaProvider, 
  useUnifiedMediaContext,
  type MediaConfig,
  type MediaState,
  type MediaActions,
  type UnifiedMediaContextType 
} from './context/UnifiedMediaContext';

// Hooks
export { 
  useUnifiedMedia,
  type UnifiedMediaHookReturn 
} from './hooks/useUnifiedMedia';

// Components
export { 
  UnifiedMediaUploadZone,
  type UnifiedMediaUploadZoneProps 
} from '@/components/organisms/media/UnifiedMediaUploadZone';

// Configuration
export { 
  MEDIA_CONFIGS,
  getMediaConfig,
  createCustomMediaConfig,
  type MediaConfigKey 
} from './config/mediaConfigs';

// Feature-specific components
export { UnifiedEventMediaUpload } from '@/features/campuscurrent/events/components/UnifiedEventMediaUpload';
export { UnifiedProductMediaUpload } from '@/features/kupi-prodai/components/forms/UnifiedProductMediaUpload';

// Legacy exports for backward compatibility (deprecated)
export { useMediaUpload } from './hooks/useMediaUpload';
export { useMediaSelection } from './hooks/useMediaSelection';
export { useMediaEdit } from './hooks/useMediaEdit';

// Types
export type { UploadMediaOptions } from './types/types';
