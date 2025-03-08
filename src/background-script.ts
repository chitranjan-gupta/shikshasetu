import {
  getAllInputFields,
  generateRandomPassword,
  generateRandomString,
  browserTabs,
  browserContextMenus,
  browserStorage,
  browserActions,
  browserScripting,
  browserRuntime,
  browserCookies,
  isChrome,
  isBrowser,
  setItem,
  getDomain,
  fetchFromLocal,
  removeFromLocal,
  saveToLocal,
} from '@/lib';
import { autofills$, domains$, accounts$, mails$, s3$ } from '@/store';
import { getDomains, addAccount, getToken, getMessages } from '@/api';

import type { TokenType, FormSchemaType } from '@/types';

// function selectFields(tabId: number): void {
//   console.log('Sending Message')
//   browserContext.tabs.sendMessage(tabId, { action: 'selectFields' })
// }

function findCareer(tabId: number): void {
  console.log('Sending Message');
  browserTabs.sendMessage(tabId, { action: 'findCareer' });
}

function findCareerURL(tabId: number): void {
  console.log('Sending Message');
  browserTabs.sendMessage(tabId, { action: 'findCareerURL' });
}

async function asyncTask() {
  try {
    const domains = (await getDomains()).data;
    if (domains && domains['hydra:member']) {
      const activeDomains = domains['hydra:member'];
      domains$.addDomains(activeDomains);
      if (activeDomains && activeDomains[0] && activeDomains[0].domain) {
        const activeDomain = activeDomains[0].domain;
        const fakeAccount = {
          address: `${generateRandomString(10, 'abcdefghijklmnopqrstuvwxyz1234567890')}@${activeDomain}`,
          password: generateRandomPassword(),
        };
        const account = (await addAccount(fakeAccount)).data;
        console.log(account);
        if (account) {
          const activeToken = (await getToken(fakeAccount)).data;
          if (activeToken) {
            accounts$.addAccount({
              ...account,
              password: fakeAccount.password,
              token: activeToken.token,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function asyncTask1() {
  try {
    const accounts = accounts$.get().accounts;
    const account = accounts.length > 0 ? accounts[0] : null;
    if (account && account.token) {
      const messages = (await getMessages(account.token)).data;
      if (messages && messages['hydra:member']) {
        const activeMessages = messages['hydra:member'];
        if (activeMessages) {
          mails$.addMails(activeMessages);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function initialSave() {
  const data = autofills$.get().autofills;
  const currentData = autofills$.get().currentAutofill;
  const accounts = accounts$.get().accounts;
  const account = accounts.length > 0 ? accounts[0] : null;
  if (account && account.address) {
    await browserStorage.local.set({ temp_mail: account.address });
  }
  if (data && data[currentData]) {
    await browserStorage.local.set({ currentAutofill: data[currentData] });
  }
}

function setProfile(values: FormSchemaType & { id?: string }) {
  if (values?.id) {
    autofills$.editAutofill({ ...values, id: values.id! });
  } else {
    autofills$.addAutofill(values);
  }
}

async function saveDetails(url: string | null) {
  const profiles = autofills$.get().autofills;
  const account = autofills$.get().currentAutofill;
  if (url) {
    if (isChrome && !isBrowser && browserStorage) {
      const details = await fetchFromLocal([url]);
      if (details && details[url]) {
        const currentProfile = profiles[account] ?? {};
        const existingDetails =
          currentProfile && currentProfile?.sites
            ? (currentProfile.sites ?? {})
            : {};
        setProfile({
          ...currentProfile,
          sites: { ...existingDetails, ...details },
        });
      }
      await removeFromLocal([url]);
    } else {
      browserStorage.local.get([url], (details: any) => {
        if (details && details[url]) {
          const currentProfile = profiles[account] ?? {};
          const existingDetails =
            currentProfile && currentProfile?.sites
              ? (currentProfile.sites ?? {})
              : {};
          setProfile({
            ...currentProfile,
            sites: { ...existingDetails, ...details },
          });
          browserStorage.local.remove([url], () => {
            console.log('url is removed');
          });
        }
      });
    }
  }
}

async function initialDetails() {
  const profiles = autofills$.get().autofills;
  const account = autofills$.get().currentAutofill;
  if (isChrome && !isBrowser) {
    console.log('chrome', 'yes');
    (async () => {
      if (browserStorage) {
        const details = await fetchFromLocal(['sitesurls', 'currentAutofill']);
        if (details && details['sitesurls']) {
          const data = details['sitesurls'];
          if (data) {
            Object.keys(data).forEach(async (u) => await saveDetails(u));
          }
          await removeFromLocal(['sitesurls']);
        }
        if (details && profiles.length > 0) {
          await saveToLocal({ currentAutofill: profiles[account] });
        }
      }
    })();
  } else {
    console.log('firefox', 'yes');
    if (browserStorage) {
      browserStorage.local.get(
        ['sitesurls', 'currentAutofill'],
        (details: any) => {
          console.log('details', details);
          if (details && details['sitesurls']) {
            const data = details['sitesurls'];
            if (data) {
              Object.keys(data).forEach(async (u) => await saveDetails(u));
            }
            browserStorage.local.remove(['sitesurls'], () => {
              console.log('sitesurls is removed');
            });
          }
          if (details && profiles.length > 0) {
            browserStorage.local.set(
              { currentAutofill: profiles[account] },
              () => {
                console.log('currentAutofill is set for initial');
              }
            );
          }
        }
      );
    }
  }
}

browserCookies.onChanged.addListener((changeInfo: any) => {
  //console.log(changeInfo.cookie);
  if (
    changeInfo.cookie.domain ===
      getDomain(import.meta.env.VITE_API_URL! ?? 'localhost') &&
    changeInfo.cookie.name === 'access_token'
  ) {
    setItem<TokenType>('token', {
      access_token: changeInfo.cookie.value,
      refresh_token: changeInfo.cookie.value,
    });
  }
});

browserRuntime.onInstalled.addListener(() => {
  browserContextMenus.create({
    id: 'openSidePanel',
    title: 'Open AI',
    contexts: ['all'],
  });

  browserContextMenus.create({
    id: 'fillDetail',
    title: 'Fill Details',
    contexts: ['selection', 'editable', 'page', 'all'],
  });

  browserContextMenus.create({
    id: 'submenu1',
    parentId: 'fillDetail',
    title: 'All',
    contexts: ['all'],
  });

  browserContextMenus.create({
    id: 'submenu2',
    parentId: 'fillDetail',
    title: 'Select Fields',
    contexts: ['all'],
  });

  browserContextMenus.create({
    id: 'submenu3',
    parentId: 'fillDetail',
    title: 'Find Career',
    contexts: ['all'],
  });

  browserContextMenus.create({
    id: 'submenu3Option1',
    parentId: 'submenu3',
    title: 'Find Career URL',
    contexts: ['all'],
  });

  browserContextMenus.create({
    id: 'submenu3Option2',
    parentId: 'submenu3',
    title: 'List Careers',
    contexts: ['all'],
  });

  if (false) {
    asyncTask().catch((error) => console.log(error));
  }
});

browserContextMenus.onClicked.addListener((info: any, tab: any) => {
  console.log('Context menu clicked');
  if (info.menuItemId === 'openSidePanel') {
    // This will open the panel in all the pages on the current window.
    if (chrome && chrome.sidePanel) {
      chrome.sidePanel.setOptions({
        tabId: tab?.id || -1,
        path: '/src/sidepanel/index.html',
        enabled: true,
      });
      chrome.sidePanel.open({ tabId: tab?.id || -1 });
    } else if (browser && browser.sidebarAction) {
      browser.sidebarAction.open();
    }
  }
  if (info.menuItemId === 'submenu1') {
    const current = autofills$.get().currentAutofill || 0;
    const storedData =
      autofills$.get().autofills.length > 0
        ? autofills$.get().autofills[current]
        : undefined;
    if (tab?.id) {
      browserScripting.executeScript({
        target: { tabId: tab.id },
        func: getAllInputFields,
        args: [storedData || {}],
      });
    }
  }
  // if (info.menuItemId === "submenu2") {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     func: addDetailToInput,
  //   });
  // }
  if (info.menuItemId === 'submenu3Option1') {
    console.log('Clicked submenu3Option1');
    if (tab?.id) {
      findCareerURL(tab.id);
    }
  }
  if (info.menuItemId === 'submenu3Option2') {
    console.log('Clicked submenu3Option2');
    if (tab?.id) {
      findCareer(tab.id);
    }
  }
});

browserRuntime.onMessage.addListener((message: any, sender: any) => {
  if (message.action === 'fetchData') {
    initialSave();
  } else if (message.action === 'fetchFiles') {
    const files = s3$.get().buckets;
    console.log('files', files);
    const data = autofills$.get().autofills;
    console.log('data', data);
    const currentData = autofills$.get().currentAutofill;
    const currentFiles =
      files && files.length > 0 ? files[currentData] : new Map();
    console.log('currentFiles', currentFiles);
    const currentDocumentFiles = Array.from(currentFiles);
    browserTabs.sendMessage(
      typeof sender.tab?.id !== 'undefined' ? sender.tab?.id : -1,
      { action: 'addFiles', data: currentDocumentFiles }
    );
  } else if (message.action === 'fetchMessages') {
    asyncTask1().catch((error) => console.log(error));
  } else if (message.action === 'open_popup') {
    console.log('Opening popup');
    if (isChrome && !isBrowser) {
      browserActions.openPopup();
    }
  } else if (message.action === 'sender') {
    console.log(sender);
  } else if (message.action === 'initialDetails') {
    initialDetails();
  }
});

// Establish a connection with the content script
browserRuntime.onConnect.addListener(function (port: any) {
  console.assert(port.name === 'content-script');
  port.onMessage.addListener(function (msg: any) {
    if (msg.action === 'hello') {
      port.postMessage({ message: 'Hello from background script!' });
    }
  });
});

// browserTabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // Ensure that the tab is fully loaded
//   if (changeInfo.status === 'complete') {
//     const currentUrl = tab.url;
//     const data = autofills$.get().autofills;
//     const currentData = data[autofills$.get().currentAutofill];
//     if (currentData && currentData?.sites) {
//       const siteData = currentData?.sites[currentUrl];
//       if (siteData) {
//         console.log(tabId);
//         sendNotification(currentUrl);
//       }
//     }
//   }
// });

// Function to send a notification
// function sendNotification(url: string | undefined) {
// browserNotification.create({
//   type: 'basic',
//   iconUrl: '/assets/icons/icon128.png',
//   title: 'Site data is stored',
//   message: `The URL ${url} is in your autofills.`,
//   priority: 1,
// });
// }
