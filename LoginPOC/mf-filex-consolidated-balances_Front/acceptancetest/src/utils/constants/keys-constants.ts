type UserInfo = {
  DOCUMENTTYPE: string;
  DOCUMENTNUMBER: string;
  ALIAS: string;
  PASSWORD: string;
  TYPEUSER: string;
  [key: string]: string;
};


const USERS_INFO: UserInfo = {
 DOCUMENTTYPE: '#{documentTypeAccep}#',
 DOCUMENTNUMBER: '#{documentNumberAccep}#',
 ALIAS: '#{aliasAccep}#',
  PASSWORD: '#{passwordAccep}#',
  TYPEUSER: '#{typeUserAccep}#',

  };



type UserKey = keyof typeof USERS_INFO;

export function getUserInfo(field: UserKey, position: number): string {
  const value = USERS_INFO[field];

  if (!value) return '';

  return value.trim().split(',')[position]?.trim() || '';
}
