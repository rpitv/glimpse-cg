export default defineEventHandler(async (event): Promise<string> => {
  const url = getQuery(event).url;
  const format = event.context.params?.format;

  // Root endpoint
  if (!event.context.params?.format && !getQuery(event).url) {
    return 'OK from remote-fetch! Please use a version endpoint.';
  }

  if (!url) {
    setResponseStatus(event, 400);
    return 'Missing target URL query parameter.';
  }

  // Determine MIME type
  let mimeFollow = false;
  let mimeType = 'text/plain';
  switch (format) {
    case 'json':
      mimeType = 'application/json';
      break;
    case 'xml':
      mimeType = 'text/xml';
      break;
    case 'js':
    case 'javascript':
      mimeType = 'text/javascript';
      break;
    case 'htm':
    case 'html':
      mimeType = 'text/html';
      break;
    case 'follow':
      mimeFollow = true;
      break;
    case 'text':
    case 'txt':
    default:
      mimeType = 'text/plain';
  }

  try {
    const targetURL = decodeURIComponent(Array.isArray(url) ? url[0] : url);
    const targetRes = await fetch(targetURL);
    let targetMime = mimeType;
    if (mimeFollow) {
      targetMime = targetRes.headers.get('content-type') || mimeType;
    }
    const data = await targetRes.text();
    setResponseHeader(event, 'content-type', targetMime);
    return data;
  }
  catch (e: any) {
    setResponseStatus(event, 500);
    return 'fetch failed: ' + e;
  }
});
