/**
 * Cloud Functions for The Player's Companion
 *
 * These Firestore triggers keep the denormalized `campaign.memberUids` array
 * in sync whenever a member doc is created or deleted in the
 * `campaigns/{campaignId}/members/{uid}` subcollection.
 *
 * This avoids the need for client-side memberUids arrayUnion/arrayRemove
 * (which would require granting players write access to the campaign doc).
 */

import { onDocumentCreated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

/**
 * When a member document is created → add their UID to campaign.memberUids.
 */
export const onMemberCreated = onDocumentCreated(
  'campaigns/{campaignId}/members/{uid}',
  async (event) => {
    const { campaignId, uid } = event.params;
    const campaignRef = db.doc(`campaigns/${campaignId}`);

    try {
      await campaignRef.update({
        memberUids: FieldValue.arrayUnion(uid),
        updatedAt: Date.now(),
      });
      console.log(`[onMemberCreated] Added ${uid} to campaign ${campaignId} memberUids`);
    } catch (err) {
      console.error(`[onMemberCreated] Failed to update memberUids for campaign ${campaignId}:`, err);
    }
  },
);

/**
 * When a member document is deleted → remove their UID from campaign.memberUids.
 */
export const onMemberDeleted = onDocumentDeleted(
  'campaigns/{campaignId}/members/{uid}',
  async (event) => {
    const { campaignId, uid } = event.params;
    const campaignRef = db.doc(`campaigns/${campaignId}`);

    try {
      // Check if campaign still exists (might be cascade-deleted)
      const campaignSnap = await campaignRef.get();
      if (!campaignSnap.exists) {
        console.log(`[onMemberDeleted] Campaign ${campaignId} no longer exists, skipping.`);
        return;
      }

      await campaignRef.update({
        memberUids: FieldValue.arrayRemove(uid),
        updatedAt: Date.now(),
      });
      console.log(`[onMemberDeleted] Removed ${uid} from campaign ${campaignId} memberUids`);
    } catch (err) {
      console.error(`[onMemberDeleted] Failed to update memberUids for campaign ${campaignId}:`, err);
    }
  },
);
