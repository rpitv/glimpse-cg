// Delete a channel via server API
export async function deleteChannel(channel: string) {
  if (!channel || channel === 'default') return { success: false, error: 'Invalid channel' };
  const res = await fetch('/api/delete-channel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel })
  });
  return await res.json();
}
