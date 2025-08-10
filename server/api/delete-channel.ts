import { deleteReplicantChannel } from '~/utils/replicants';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { channel } = body;
  if (!channel || channel === 'default') {
    return { success: false, error: 'Invalid channel' };
  }
  deleteReplicantChannel(channel);
  return { success: true };
});
