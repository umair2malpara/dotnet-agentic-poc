import { environment } from '../../../environments/environment';

export function apiUrl(path: string): string {
  const baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');
  const resourcePath = path.replace(/^\/+/, '');
  return `${baseUrl}/${resourcePath}`;
}
