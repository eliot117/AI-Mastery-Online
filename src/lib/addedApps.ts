export interface AddedAppSpec {
  id: string;
  name: string;
  url: string;
  folder: string;
  logoUrl: string;
  revision: number;
}

/**
 * Apps explicitly added in this conversation. Synced once per account into the
 * matching folder without modifying any pre-existing apps.
 */
export const ADDED_APPS: AddedAppSpec[] = [
  {
    id: 'dreamina',
    name: 'Dreamina',
    url: 'https://dreamina.capcut.com/ai-tool/generate?type=image&entry=seedream55',
    folder: 'content',
    logoUrl: 'https://icon.horse/icon/dreamina.capcut.com',
    revision: 1,
  },
  {
    id: 'seedance-2-5',
    name: 'Seedance 2.5',
    url: 'https://ai.byteplus.com/en/playground/model/gen_video?model=dreamina-seedance-2-5-260628',
    folder: 'content',
    logoUrl:
      'https://sf-bpcms.bytepluscdn.com/obj/byteplus-public-aiso/portal/assets/apple-touch-icon.png',
    revision: 1,
  },
];
