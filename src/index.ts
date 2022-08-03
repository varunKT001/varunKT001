import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { view } from './data';

interface DevJoke {
  question: string;
  punchline: string;
}

function fetchDevJoke(): AxiosPromise {
  const url = `https://backend-omega-seven.vercel.app/api/getjoke?${new Date().getTime()}`;
  return axios.get<DevJoke[]>(url);
}

(async function (): Promise<void> {
  // Fetching DevJoke
  const { data }: { data: DevJoke[] } = await fetchDevJoke();
  const devJoke = data[0];

  // Create new view
  const _view = Object.assign({}, { ...view, devJoke });

  // Update README.md
  const filePath = path.join(__dirname, './templates/main.ejs');

  const input = fs.readFileSync(filePath);
  const output = ejs.render(input.toString(), _view);

  fs.writeFileSync('./README.md', output);
})();
