import {
  normalizeText,
  // generateRandomEmail,
  // generateRandomPassword,
  browserStorage,
  browserRuntime,
  isChrome,
  isBrowser,
  getAllInputFields,
  setAllInputFields,
} from '@/lib';
import type { FormSchemaType } from '@/types';
import {
  // getRoot,
  setRoot,
} from './content';
import styles from '@/styles/index.css?inline';

declare global {
  interface Window {
    autofill: FormSchemaType;
    document_files: Map<string, object>;
  }
}

window.autofill = {};
window.document_files = new Map();

const initial = () => {
  console.log('Fetching data initial');
  //browserRuntime.sendMessage({ action: 'fetchData' });
  //browserRuntime.sendMessage({ action: 'fetchFiles' });
};

initial();

// Establish a connection with the background script
const port = browserRuntime.connect({ name: 'content-script' });
port.postMessage({ action: 'hello' });
port.onMessage.addListener(function (msg: any) {
  console.log(msg);
});

document.addEventListener('click', function (event) {
  attachForm();
  createAutocompleteList(event);
});

function createAutocompleteList(event: Event) {
  const isList = document.querySelector('.autocomplete-list-shiksha-setu');
  if (isList) {
    isList.remove();
  }
  // browserRuntime.sendMessage({ action: 'fetchData' });
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    console.log('Autofill Invoked');
    const target = event.target as HTMLInputElement;
    if (target) {
      console.log('Target is input');
      const list = document.createElement('div');
      list.classList.add('autocomplete-list-shiksha-setu');
      const shadowList = list.attachShadow({ mode: 'open' });
      (target.parentNode as HTMLElement).appendChild(list);
      console.log('ShadowDom is created');
      const innerCustomMenu = document.createElement('div');
      shadowList.appendChild(innerCustomMenu);
      console.log('Inserting Div into ShadowDom');
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(styles);
      //const extraSheet = new CSSStyleSheet();
      // extraSheet.replaceSync("* { all: initial }");
      // Check if adoptedStyleSheets is supported
      if (isChrome && !isBrowser) {
        // Use adoptedStyleSheets if supported (Chrome, Edge, etc.)
        console.log('Inserting css into ShadowDom');
        shadowList.adoptedStyleSheets = [sheet];
      } else {
        // Fallback for Firefox and other browsers that don't support adoptedStyleSheets
        console.log('Inserting style in ShadowDom');
        const styleElement = document.createElement('style');
        styleElement.textContent = styles; // Assuming 'styles' is a string with CSS rules
        shadowList.appendChild(styleElement);
      }
      //console.log(window.document_files);
      console.log('browserStorage');
      browserStorage.local.get(
        ['currentAutofill', 'temp_mail'],
        (result: any) => {
          if (result && (result.currentAutofill || result.temp_mail)) {
            console.log('storage is fetched');
            setRoot(
              shadowList,
              event,
              Object.entries({
                temp_mail: result.temp_mail || 'temp@mail.com',
                ...result.currentAutofill,
              }),
              new Map() //new Map(window.document_files)
            );
          }
        }
      );
      // target.addEventListener('input', (e) => {
      //   const inputValue = (e?.target as HTMLInputElement)?.value.toLowerCase();
      //   const filteredData = data.filter((item) => item.toLowerCase().includes(inputValue));
      //   const listItems = filteredData.map((item) => `<li>${item}</li>`).join('');
      //   list.innerHTML = `<ul>${listItems}</ul>`;
      //   list.style.display = 'block';
      // });
      // target.addEventListener('blur', (event) => {
      //   console.log(event)
      //   if(event.target){
      //     // const element = event.target;
      //   }
      //   const autoComplete = (target.parentNode as HTMLElement).querySelector(
      //     '.autocomplete-list-shiksha-setu'
      //   );
      //   if (autoComplete) {
      //     autoComplete.remove();
      //   }
      // });
    }
  }
}

function attachForm() {
  if (document.documentElement.dataset.formAttached) {
    return;
  }
  const forms = document.querySelectorAll('form');
  console.log(forms);
  forms.forEach((form: HTMLFormElement) => {
    document.documentElement.setAttribute('data-form-attached', 'true');
    console.log('Form Attached');
    form.onsubmit = () => {
      if (!form) {
        return;
      }
      console.log('form', form);
      const formData = new FormData(form);
      console.log('formData', formData);
      const formDatas = formData.entries();
      console.log('formDatas', formDatas);
      if (formData && formDatas) {
        let jsonObject: any = {};
        if (isChrome && !isBrowser) {
          console.log('chrome', 'yes');
          jsonObject = Object.fromEntries(formDatas);
        } else {
          console.log('firefox', 'yes');
          let currentResult = formDatas.next();
          while (!currentResult.done) {
            const resultValue = currentResult.value;
            if (!(resultValue[1] instanceof File)) {
              jsonObject[resultValue[0]] = resultValue[1];
            }
            currentResult = formDatas.next();
          }
        }
        console.log('jsonObject', jsonObject);
        //const json: Record<string, FormDataEntryValue> = {};
        const jsonRef = window.location.href;
        // for (const [key, value] of formData) {
        //   (json as Record<string, FormDataEntryValue>)[key] = value;
        // }
        console.log('browserStorage', browserStorage);
        browserStorage.local.get(['sitesurls'], (result: any) => {
          if (result && result.sitesurls) {
            browserStorage.local.set(
              {
                [jsonRef]: jsonObject,
                sitesurls: { ...result.sitesurls, [jsonRef]: true },
              },
              () => {
                console.log('Form Value is set');
              }
            );
          } else {
            browserStorage.local.set(
              {
                [jsonRef]: jsonObject,
                sitesurls: { [jsonRef]: true },
              },
              () => {
                console.log('Form Value is set');
              }
            );
          }
        });
        console.log('browserRuntime', browserRuntime);
        browserRuntime.sendMessage({
          action: 'initialDetails',
        });
      }
    };
  });
}

attachForm();

function findCareer() {
  const jobListings = new Map(); // Using a Map for better duplicate checking and optimized performance.
  const jobSelectors = [
    '.job-listing',
    '.job-post',
    '.career-opportunity',
    '[class*="job"]',
    '[class*="career"]',
    'article',
    '.card',
    '.list-item',
    '.vacancy',
    '.position',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'title',
    'li',
    '.posting-headline',
    'meta',
  ];

  const jobElements = document.querySelectorAll(jobSelectors.join(', '));
  jobElements.forEach((element) => {
    // Extract the title (use the most likely headings or classes)
    const titleElement = element.querySelector(
      'title, h1, a, h2, h3, h4, .job-title, .position-title, .posting-headline, [class*="title"]'
    );
    const title =
      titleElement?.textContent?.trim() ||
      (element.tagName === 'TITLE' ? element.textContent?.trim() : '') ||
      ((element as HTMLMetaElement)?.name &&
      /title/i.test((element as HTMLMetaElement).name)
        ? (element as HTMLMetaElement).content
        : '') ||
      'No Title Provided';

    // Extract the company (use a fallback to 'No Company Provided' if not found)
    const company =
      element
        .querySelector(
          'title, .company-name, .organization, [class*="company"]'
        )
        ?.textContent?.trim() ?? 'No Company Provided';

    // Extract the location (fallback to 'No Location Provided')
    const location =
      element
        .querySelector('.location, .job-location, [class*="location"]')
        ?.textContent?.trim() || 'No Location Provided';

    // Extract the link (convert relative links to absolute)
    let link = element.querySelector('a')?.href || window.location.href;
    if (link && !link.startsWith('http')) {
      link = new URL(link, window.location.href).href; // Converts relative link to absolute
    }

    // Check if the link contains the words "job" or "career"
    if (link && (link.includes('job') || link.includes('career'))) {
      // Only add the job if it's not already in the Map (based on the title as the key)
      if (title && !jobListings.has(title)) {
        jobListings.set(title, { title, company, location, link });
      }
    }
  });

  // Convert the Map values to an array before returning (Map ensures no duplicates)
  return { jobListings: Array.from(jobListings.values()) };
}

function findCareerURL() {
  const careerKeywords = [
    'career',
    'careers',
    'jobs',
    'job',
    'opportunities',
    'work-with-us',
    'work with us',
    'join-us',
    'join us',
    'join',
    'about',
    'about us',
    'about-us',
  ];
  const links = Array.from(document.getElementsByTagName('a'));

  const careerLinks = links.filter((link) => {
    const href = link.href.toLowerCase();
    const text = (link.textContent || '').toLowerCase();
    return careerKeywords.some(
      (keyword) => href.includes(keyword) || text.includes(keyword)
    );
  });

  const careerURLs = careerLinks.map((link) => ({
    url: link.href,
    text: link.textContent?.trim() || '',
  }));

  return { careerURLs };
}

browserRuntime.onMessage.addListener((request: any) => {
  // console.log('Message received')
  if (request.action === 'findCareerURL') {
    const result = findCareerURL();
    console.log(result);
    addCareerUrl(result);
  } else if (request.action === 'findCareer') {
    const result = findCareer();
    console.log(result);
  } else if (request.action === 'addData') {
    window.autofill = request.data;
  } else if (request.action === 'addFiles') {
    window.document_files = request.data;
  } else if (request.action === 'fill') {
    console.log('Fill Message received');
    if (request.data) {
      getAllInputFields(request.data);
    }
  } else if (request.action === 'sitefill') {
    console.log('SiteFill Message received');
    if (request.data) {
      setAllInputFields(request.data);
    }
  }
});

interface CareerURL {
  url: string;
  text: string;
}

interface CareerURLResult {
  careerURLs: CareerURL[];
}

function addCareerUrl(result: CareerURLResult): void {
  const existingMenu = document.querySelector('.custom-bottom--top-right-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  const customDialog = document.createElement('div');
  customDialog.classList.add('custom-bottom--top-right-menu');
  customDialog.style.position = 'fixed';
  customDialog.style.top = '0';
  customDialog.style.right = '0';
  customDialog.style.maxHeight = '200px';
  customDialog.style.backgroundColor = 'white';
  customDialog.style.border = '1px solid #ccc';
  customDialog.style.padding = '15px';
  customDialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  customDialog.style.borderRadius = '5px'; // Optional, for better styling
  customDialog.style.zIndex = '9999'; // High enough to appear above other page content
  customDialog.style.overflowY = 'scroll';
  customDialog.style.cursor = 'pointer';
  result.careerURLs.forEach((item) => {
    const tagNameItem = document.createElement('div');
    tagNameItem.textContent = `${normalizeText(item.text || '')}`;
    tagNameItem.style.padding = '5px 0 5px 10px';
    tagNameItem.style.cursor = 'pointer';
    tagNameItem.style.borderTop = '1px solid gray';
    tagNameItem.addEventListener('click', function () {
      window.open(item.url, '_blank');
    });
    customDialog.appendChild(tagNameItem);
  });
  document.body.appendChild(customDialog);
  document.addEventListener(
    'click',
    function () {
      cleanUpTopMenu();
    },
    { once: true }
  );

  // Function to remove the custom menu from the DOM
  function cleanUpTopMenu(): void {
    customDialog.remove();
  }
}

// function MenuItem(title: string) {
//   const div = document.createElement('div');
//   div.textContent = title;
//   div.style.marginTop = '10px';
//   div.style.padding = '5px 0';
//   div.style.borderTop = '1px solid gray';
//   div.style.cursor = 'pointer';
//   div.style.fontWeight = 'semibold';
//   return div
// }

// function MenuSubItem(title: string) {
//   const div = document.createElement('div');
//   div.textContent = title;
//   div.style.padding = '5px 0 0 10px';
//   div.style.borderTop = '1px solid gray';
//   div.style.cursor = 'pointer';
//   return div
// }

// document.addEventListener('contextmenu', function (event) {
//   if (window.autofills.length === 0) {
//     browserRuntime.sendMessage({ action: 'fetchData' });
//   }

//   // Prevent the default context menu from being hidden (no need to call preventDefault())
//   event.stopPropagation(); // Prevent event propagation to avoid conflicts with other listeners

//   // Check if there's already an existing custom menu in the bottom-right corner and remove it
//   const existingMenu = document.querySelector('.custom-bottom-right-menu');
//   if (existingMenu) {
//     existingMenu.remove();
//   }

//   // Create a custom menu div that will be positioned in the bottom-right corner
//   const customMenu = document.createElement('div');
//   customMenu.classList.add('custom-bottom-right-menu');
//   customMenu.style.position = 'fixed'; // Fixed positioning ensures it stays in the corner
//   customMenu.style.bottom = '10px'; // Adjust to position it a bit above the edge of the page
//   customMenu.style.right = '10px'; // Adjust to position it a bit to the left of the screen edge
//   customMenu.style.backgroundColor = 'white';
//   customMenu.style.border = '1px solid #ccc';
//   customMenu.style.padding = '15px';
//   customMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
//   customMenu.style.cursor = 'pointer';
//   customMenu.style.zIndex = '9999'; // High enough to appear above other page content
//   customMenu.style.borderRadius = '5px'; // Optional, for better styling
//   customMenu.style.maxHeight = '200px'; // Optional, to limit the height of the menu
//   customMenu.style.overflowY = 'scroll';

//   // Add items to the custom menu
//   const menuTitle = document.createElement('div');
//   menuTitle.textContent = 'Autofill details';
//   menuTitle.style.fontWeight = 'bold';
//   menuTitle.style.paddingBottom = '10px';
//   menuTitle.style.backgroundColor = '#f9f9f9';
//   // Append menu title to the custom menu
//   customMenu.appendChild(menuTitle);

//   // browserStorage.local.get('submissionData', (result) => {
//   //   console.log(result.submissionData)
//   // })

//   const tempemail = MenuItem('Temp Email');
//   tempemail.addEventListener('click', function () {
//     if (event.target) {
//       (event.target as HTMLInputElement).value = generateRandomEmail();
//     }
//   });
//   customMenu.appendChild(tempemail);

//   const temppassword = MenuItem('Temp Password');
//   temppassword.addEventListener('click', function () {
//     if (event.target) {
//       (event.target as HTMLInputElement).value = generateRandomPassword();
//     }
//   });
//   customMenu.appendChild(temppassword);

//   Object.entries(
//     window.autofills.length > 0 ? window.autofills[0] : []
//   ).forEach(([key, value]) => {
//     if (Array.isArray(value)) {
//       const menuItem = MenuItem(normalizeText(key || ''));
//       customMenu.appendChild(menuItem);
//       value.forEach((item) => {
//         const menuSubItem = MenuSubItem(`> ${normalizeText(typeof item === 'object' ? item.documentType : item || '')}`)
//         menuSubItem.addEventListener('click', function () {
//           if (event.target) {
//             (event.target as HTMLInputElement).value =
//               typeof item === 'object'
//                 ? (item.file[0].name as unknown as string)
//                 : item;
//           }
//         });
//         customMenu.appendChild(menuSubItem);
//       });
//     } else if (typeof value === 'object') {
//       const menuItem = MenuItem(normalizeText(key || ''));
//       customMenu.appendChild(menuItem);
//       if (value) {
//         Object.entries(value).forEach(([k, v]) => {
//           const menuSubItem = MenuSubItem(`> ${normalizeText(k || '')}`);
//           menuSubItem.addEventListener('click', function () {
//             if (event.target) {
//               (event.target as HTMLInputElement).value = v as string;
//             }
//           });
//           customMenu.appendChild(menuSubItem);
//         });
//       }
//     } else {
//       const menuItem = MenuItem(normalizeText(key || ''));
//       menuItem.addEventListener('click', function () {
//         if (event.target) {
//           (event.target as HTMLInputElement).value = value as string;
//         }
//       });
//       customMenu.appendChild(menuItem);
//     }
//   });

//   // Append the custom menu to the body
//   document.body.appendChild(customMenu);

//   // Cleanup the custom menu when user clicks anywhere else
//   document.addEventListener(
//     'click',
//     function () {
//       cleanUpMenu();
//     },
//     { once: true }
//   );

//   // Function to remove the custom menu from the DOM
//   function cleanUpMenu() {
//     customMenu.remove();
//   }
// });

// document.addEventListener('keydown', function(event){
//   console.log(event)
//   const autoComplete = document.querySelector(".autocomplete-list-shiksha-setu");
//   if(!autoComplete){
//     createAutocompleteList();
//   }
// })

// function addDropDownMenu(){
//   // Create a custom menu div that will be positioned in the bottom-right corner
//   const customMenu = document.createElement('div');
//   customMenu.classList.add('custom-top-right-menu');

//   const shadowCustomMenu = customMenu.attachShadow({ mode: 'open' });

//   // Append the custom menu to the body
//   document.body.appendChild(customMenu);

//   const innerCustomMenu = document.createElement('div');
//   shadowCustomMenu.appendChild(innerCustomMenu);
//   const sheet = new CSSStyleSheet();
//   sheet.replaceSync(styles);
//   const extraSheet = new CSSStyleSheet();
//   // extraSheet.replaceSync("* { all: initial }");
//   shadowCustomMenu.adoptedStyleSheets = [extraSheet, sheet];

//   setRoot(
//     shadowCustomMenu,

//     Object.entries(window.autofills.length > 0 ? window.autofills[0] : [])
//   );

// }

// document.addEventListener('contextmenu', function (event) {
//   if (window.autofills.length === 0) {
//     browserRuntime.sendMessage({ action: 'fetchData' });
//   }

//   // Prevent the default context menu from being hidden (no need to call preventDefault())
//   event.stopPropagation(); // Prevent event propagation to avoid conflicts with other listeners

//   // Check if there's already an existing custom menu in the bottom-right corner and remove it
//   const existingMenu = document.querySelector('.custom-bottom-right-menu');
//   if (existingMenu) {
//     existingMenu.remove();
//   }

//   // Create a custom menu div that will be positioned in the bottom-right corner
//   const customMenu = document.createElement('div');
//   customMenu.classList.add('custom-bottom-right-menu');

//   const shadowCustomMenu = customMenu.attachShadow({ mode: 'open' });

//   // Append the custom menu to the body
//   document.body.appendChild(customMenu);

//   const innerCustomMenu = document.createElement('div');
//   shadowCustomMenu.appendChild(innerCustomMenu);

//   getRoot(
//     innerCustomMenu,
//     event,
//     Object.entries(window.autofills.length > 0 ? window.autofills[0] : [])
//   );

//   const sheet = new CSSStyleSheet();
//   sheet.replaceSync(styles);
//   shadowCustomMenu.adoptedStyleSheets = [sheet];

//   // Cleanup the custom menu when user clicks anywhere else
//   document.addEventListener(
//     'click',
//     function () {
//       cleanUpMenu();
//     },
//     { once: true }
//   );

//   // Function to remove the custom menu from the DOM
//   function cleanUpMenu() {
//     customMenu.remove();
//   }
// });
