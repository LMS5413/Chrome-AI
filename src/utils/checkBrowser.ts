export async function checkBrowser(): Promise<boolean> {
  
    const version = getChromeVersion();
  
    const ai = (window as any).ai;
    const state = await ai?.canCreateGenericSession();
    return version < 127 || state === "readily";
}

function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : 0;
}