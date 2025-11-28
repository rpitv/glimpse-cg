import { replicants } from '~/utils/replicants';

// Endpoint handler
function handleLowerThirdScoreboard(params: any) {
  const { param1, param2, param3 } = params;
  if (!param1) {
    return {
      statusCode: 400,
      body: {
        code: 400,
        msg: 'missing description, underscores _ will be replaced with spaces. config/lt-scoreboard/__DESCRIPTION__/__FONT_SIZE_0.0__/__TIMER_ON__',
      },
    };
  }
  const description = param1.replace(/_+/g, ' ');
  const size = parseFloat(param2);
  const timer = !!(param3 && param3 === 'true');
  const config = replicants.lowerThird.goToBreak;
  config.description.text = description;
  if (size != null) config.description.fontSize = size;
  config.description.clock = timer;
  return {
    statusCode: 200,
    body: {
      code: 200,
      msg: 'parsed config',
      description,
      size,
      timer,
    },
  };
}

const endpointsConfigs = {
  'lt-scoreboard': handleLowerThirdScoreboard,
};

// Main Nuxt API handler
export default async function config(event: any, paramsArr: string[]) {
  const [endpoint, ...rest] = paramsArr;
  const params: Record<string, string> = {};
  rest.forEach((val, idx) => params[`param${idx + 1}`] = val);

  if (!endpointsConfigs[endpoint as keyof typeof endpointsConfigs]) {
    return {
      statusCode: 400,
      body: { code: 400, msg: `invalid endpoint in config '${endpoint}'` },
    };
  }
  return endpointsConfigs[endpoint as keyof typeof endpointsConfigs](params);
}
