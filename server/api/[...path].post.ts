import { replicants } from '~/utils/replicants';
import { Commentator } from '~/types/replicants';

export default defineEventHandler(async (event) => {
  const body = readBody(event);
  const params = getRouterParam(event, 'path');
  if (params?.toLowerCase() === 'lowerthird/commentators/people') {
    console.log(body instanceof Commentator);
  }
});
