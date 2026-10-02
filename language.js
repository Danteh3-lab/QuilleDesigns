(() => {
  'use strict';

  const englishToDutch = new Map(Object.entries({
    'Quille Designs | Marketing & Design Studio': 'Quille Designs | Marketing- en ontwerpbureau',
    'Our work | Quille Designs': 'Ons werk | Quille Designs',
    'Quille Designs is an independent creative studio. We create commercials, posters, logos and business cards, and manage social media for businesses.': 'Quille Designs is een onafhankelijke creatieve studio. We maken reclames, posters, logo’s en visitekaartjes en beheren social media voor bedrijven.',
    'We create commercials, posters, logos and business cards for businesses, and manage their social media.': 'We maken reclames, posters, logo’s en visitekaartjes voor bedrijven en beheren hun social media.',
    'Explore brand identities and films by Quille Designs. Browse selected projects and view the artwork in full.': 'Bekijk het werk van Quille Designs: merkidentiteiten, films en volledige projectbeelden.',
    'Services': 'Diensten',
    'Start a project': 'Project starten',
    'Book an appointment': 'Afspraak boeken',
    'About us': 'Over ons',
    'Marketing & design studio': 'Marketing- en ontwerpstudio',
    'A brand': 'Een merk',
    'that': 'dat',
    'feels like you': 'bij je past',
    'Our services': 'Onze diensten',
    'Scroll': 'Scrollen',
    'Brand Identity': 'Merkidentiteit',
    'Promo Production': 'Reclameproductie',
    'Poster Design': 'Posterontwerp',
    'Logo Design': 'Logo-ontwerp',
    'Business Card Design': 'Visitekaartjesontwerp',
    'Social Media Management': 'Socialmediabeheer',
    'Web Design': 'Webdesign',
    'Performance Marketing': 'Resultaatgerichte marketing',
    'Social & Content': 'Social media & content',
    'SEO & Growth': 'SEO & groei',
    '(01) / Manifesto': '(01) / Manifest',
    'Good marketing starts with a clear idea. We turn that idea into a brand people recognise and remember.': 'Goede marketing begint met een helder idee. We vertalen dat idee naar een merk dat mensen herkennen en onthouden.',
    '(02) / What we do': '(02) / Wat we doen',
    'Make your business': 'Maak je bedrijf',
    'easy to recognise.': 'herkenbaar.',
    'We produce commercials, design posters, logos and business cards, and manage social media for your business.': 'We maken reclames, ontwerpen posters, logo’s en visitekaartjes. Ook beheren we de social media van je bedrijf.',
    'Discuss your brief': 'Bespreek je briefing',
    'Video, print and social media for your business.': 'Video, drukwerk en social media voor je bedrijf.',
    'Identity': 'Identiteit',
    'Promo production': 'Reclameproductie',
    'Commercials': 'Reclames',
    'for businesses': 'voor bedrijven',
    'We produce commercials for businesses, from the shoot to the finished edit.': 'We maken reclames voor bedrijven, van de opnames tot de montage.',
    'Promo production services': 'Diensten voor reclameproductie',
    'Commercial shoots': 'Reclameshoots',
    'Video editing': 'Videomontage',
    'Promo videos': 'Promovideo’s',
    'Brand identity': 'Merkidentiteit',
    '& logo design': '& logo-ontwerp',
    'We design logos and visual identities that fit your business and are easy to recognise.': 'We ontwerpen logo’s en visuele identiteiten die bij je bedrijf passen en je bedrijf herkenbaar maken.',
    'Logo design': 'Logo-ontwerp',
    'Colour & typography': 'Kleur & typografie',
    'Brand guidelines': 'Merkrichtlijnen',
    'Stationery': 'Huisstijldrukwerk',
    'Print': 'Drukwerk',
    'We design posters for events, promotions and campaigns.': 'We ontwerpen posters voor evenementen, acties en campagnes.',
    'Poster design services': 'Posterontwerpdiensten',
    'Event posters': 'Evenementposters',
    'Promotional posters': 'Actieposters',
    'Campaign posters': 'Campagneposters',
    'Posters': 'Posters',
    'for campaigns': 'voor campagnes',
    'Design': 'Ontwerp',
    'Logos &': 'Logo’s &',
    'business cards': 'visitekaartjes',
    'We design logos and business cards that give your business a clear, recognisable look.': 'We ontwerpen logo’s en visitekaartjes die je bedrijf een duidelijke, herkenbare uitstraling geven.',
    'Logo and business card design services': 'Diensten voor logo- en visitekaartjesontwerp',
    'Business card design': 'Visitekaartjesontwerp',
    'Poster design': 'Posterontwerp',
    'Logo & business card design': 'Logo- en visitekaartjesontwerp',
    'Social media management': 'Socialmediabeheer',
    'Content planning': 'Contentplanning',
    'Publishing': 'Berichten plaatsen',
    'We take care of the day-to-day social media for your business, so you can focus on running it.': 'We verzorgen het dagelijkse beheer van je social media, zodat jij je op je bedrijf kunt richten.',
    'Social media management services': 'Diensten voor socialmediabeheer',
    'Campaigns': 'Campagnes',
    'Advertising': 'Advertentie',
    'Social': 'Social media',
    'Social media': 'Social media',
    'social media': 'social media',
    'Managing': 'Beheer van',
    'management': 'beheer',
    'Post design': 'Postontwerp',
    'Scheduling': 'Inplannen',
    'Choose a service to see what we can do.': 'Kies een dienst en bekijk wat we voor je kunnen doen.',
    '(03) / Selected explorations': '(03) / Geselecteerde projecten',
    'Ideas,': 'Ideeën,',
    'out in the world.': 'klaar voor de wereld.',
    'Three concept brands we made to try out ideas. Take a closer look at the designs, then see how they work in context.': 'Drie conceptmerken waarmee we ideeën uitprobeerden. Bekijk de ontwerpen van dichtbij en zie daarna hoe ze in de praktijk werken.',
    'Brand identity & packaging': 'Merkidentiteit & verpakking',
    'Concept project': 'Conceptproject',
    'Show mockup': 'Mock-up tonen',
    'Art direction & poster design': 'Art direction & posterontwerp',
    'Social strategy & content design': 'Social strategie & contentontwerp',
    'View portfolio': 'Bekijk portfolio',
    'Frame sequence unavailable.': 'Beeldreeks niet beschikbaar.',
    'Open the original Mage EV financing film ↗': 'Open de originele financieringsfilm van Mage EV ↗',
    'As you scroll, the Mage EV financing film changes with the four process steps. A still image appears when reduced motion is enabled.': 'Tijdens het scrollen verandert de film van Mage EV mee met de vier processtappen. Als je minder beweging hebt ingesteld, zie je een stilstaand beeld.',
    '(04) / About us': '(04) / Over ons',
    'I always wanted to run a business, though I wasn’t sure what kind. Through background acting, I found graphic design and video editing, and realised how much I enjoyed the work. In 2025, I began building Quille Designs step by step.': 'Ik wilde altijd al ondernemen, maar wist nog niet in welke richting. Via figuratie ontdekte ik grafisch ontwerp en videobewerking, en merkte ik hoeveel plezier ik daaruit haalde. In 2025 begon ik Quille Designs stap voor stap op te bouwen.',
    'Current phase': 'Huidige fase',
    'Discover': 'Ontdekken',
    'We get to know your business and audience, then talk through what you want to achieve. That gives us a clear starting point for the shoot or design.': 'We leren je bedrijf en doelgroep kennen en bespreken wat je wilt bereiken. Zo bepalen we het vertrekpunt voor de shoot of het ontwerp.',
    'Business & audience': 'Bedrijf & doelgroep',
    'Project goals': 'Doel van het project',
    'Plan': 'Plannen',
    'We shape the idea into a clear concept. For a commercial shoot, we plan the scenes and prepare for filming.': 'We werken het idee uit tot een helder concept. Voor een reclameshoot plannen we de scènes en bereiden we de opnames voor.',
    'Creative direction': 'Creatieve richting',
    'Concept & shoot plan': 'Concept & draaiplan',
    'Create': 'Maken',
    'We shoot commercials for businesses and design posters, logos, and business cards.': 'We maken reclames voor bedrijven en ontwerpen posters, logo’s en visitekaartjes.',
    'Commercial shoots': 'Reclameshoots',
    'Posters, logos & business cards': 'Posters, logo’s & visitekaartjes',
    'Deliver': 'Opleveren',
    'We deliver videos and design files ready for the channels they’re made for. We also manage social media for businesses that want ongoing support.': 'We leveren video’s en ontwerpen klaar voor de kanalen waarvoor ze zijn gemaakt. We beheren ook social media voor bedrijven die daar doorlopend hulp bij willen.',
    'Ready-to-use files': 'Bestanden klaar voor gebruik',
    '(05) / Proof in numbers': '(05) / Cijfers die tellen',
    'The results': 'De resultaten',
    'in numbers.': 'in cijfers.',
    'These are averages across active clients over the past year. Each client can track their progress in a live dashboard.': 'Dit zijn gemiddelden van actieve klanten in het afgelopen jaar. Iedere klant kan de voortgang volgen in een live dashboard.',
    'Projects launched': 'Gelanceerde projecten',
    'Average ad return': 'Gemiddeld advertentierendement',
    'Client retention': 'Klantbehoud',
    'Avg. traffic growth': 'Gem. groei in verkeer',
    'Teams we’ve worked with': 'Teams waarmee we hebben gewerkt',
    'More than 60 teams in hospitality, retail, health and tech have worked with us.': 'Meer dan 60 teams in hospitality, retail, zorg en technologie hebben met ons samengewerkt.',
    '(06) / Kind words': '(06) / Woorden van klanten',
    'Clients': 'Klanten',
    'on record': 'aan het woord',
    '4.9 average from 60+ reviews': 'Gemiddeld 4,9 uit meer dan 60 reviews',
    '“Quille helped us rethink our brand. We got twice as many enquiries in one quarter, and the new website finally feels like us.”': '“Quille hielp ons ons merk opnieuw vorm te geven. In één kwartaal kregen we twee keer zoveel aanvragen en de nieuwe website voelt eindelijk als ons.”',
    '"Quille helped us rethink our brand. We got twice as many enquiries in one quarter, and the new website finally feels like us."': '“Quille hielp ons ons merk opnieuw vorm te geven. In één kwartaal kregen we twee keer zoveel aanvragen en de nieuwe website voelt eindelijk als ons.”',
    'Founder, Northline Coffee': 'Oprichter, Northline Coffee',
    '“In six weeks, our cost per new customer was down 41%. The reports were clear, and Quille felt like part of our team.”': '“In zes weken daalden onze kosten per nieuwe klant met 41%. De rapportages waren helder en Quille voelde als onderdeel van ons team.”',
    '"In six weeks, our cost per new customer was down 41%. The reports were clear, and Quille felt like part of our team."': '“In zes weken daalden onze kosten per nieuwe klant met 41%. De rapportages waren helder en Quille voelde als onderdeel van ons team.”',
    'Head of Growth, Fieldwork Apparel': 'Hoofd Groei, Fieldwork Apparel',
    '“They thought through every detail of our launch campaign. We saw that in the press coverage afterwards.”': '“Ze dachten goed na over elk detail van onze lanceringscampagne. Dat zagen we terug in de persaandacht.”',
    '"They thought through every detail of our launch campaign. We saw that in the press coverage afterwards."': '“Ze dachten goed na over elk detail van onze lanceringscampagne. Dat zagen we terug in de persaandacht.”',
    'CMO, Lumen Health': 'Marketingdirecteur, Lumen Health',
    '“We came to Quille for a website. They also helped us find the right words for our business. Organic traffic is now three times higher than last year.”': '“We kwamen bij Quille voor een website. Ze hielpen ons ook de juiste woorden te vinden voor ons bedrijf. Het organische verkeer is nu drie keer zo hoog als vorig jaar.”',
    '"We came to Quille for a website. They also helped us find the right words for our business. Organic traffic is now three times higher than last year."': '“We kwamen bij Quille voor een website. Ze hielpen ons ook de juiste woorden te vinden voor ons bedrijf. Het organische verkeer is nu drie keer zo hoog als vorig jaar.”',
    'Director, Thornton & Co. Architects': 'Directeur, Thornton & Co. Architects',
    'Your turn': 'Jij bent aan de beurt',
    'Let’s talk about your next project.': 'Laten we je volgende project bespreken.',
    'Book a first call': 'Plan een eerste gesprek',
    '(07) / Let’s talk': '(07) / Laten we praten',
    '(07) / Let\'s talk': '(07) / Laten we praten',
    'Tell people': 'Laat mensen zien',
    'what makes': 'wat jou',
    'you different.': 'anders maakt.',
    'Tell us what you’re trying to do. We’ll reply within one business day with a few questions or a clear next step.': 'Vertel ons wat je wilt bereiken. Binnen één werkdag krijg je een paar vragen of een duidelijke vervolgstap van ons.',
    'Name': 'Naam',
    'Jane Doe': 'Jan de Vries',
    'Email': 'E-mailadres',
    'What are you looking to achieve?': 'Wat wil je bereiken?',
    'I’m interested in': 'Ik heb interesse in',
    "I'm interested in": 'Ik heb interesse in',
    'Branding': 'Branding',
    'Paid Ads': 'Betaalde advertenties',
    'Budget': 'Budget',
    '$5k to $15k': '$5k tot $15k',
    '$15k to $40k': '$15k tot $40k',
    'Project details': 'Projectdetails',
    'We never share your details.': 'We delen je gegevens nooit.',
    'Send enquiry': 'Aanvraag versturen',
    'Please add your name and a valid email.': 'Vul je naam en een geldig e-mailadres in.',
    'Sent': 'Verzonden',
    'Show artwork': 'Ontwerp tonen',
    'We help businesses build clearer brands and better campaigns.': 'We helpen bedrijven aan een herkenbaar merk en betere campagnes.',
    'Process': 'Proces',
    'Results': 'Resultaten',
    'Paid Media': 'Betaalde media',
    'Mon to Fri, 9am to 6pm': 'Ma t/m vr, 9.00–18.00 uur',
    'Quille Designs. All rights reserved.': 'Quille Designs. Alle rechten voorbehouden.',
    'Top': 'Naar boven',
    'Skip to selected work': 'Ga naar het geselecteerde werk',
    '[ 00 ] Index': '[ 00 ] Overzicht',
    'Independent marketing & design studio': 'Onafhankelijk marketing- en ontwerpbureau',
    'Logo design & film': 'Logo-ontwerp & film',
    'Brand identity, film and campaign work.': 'Merkidentiteit, film en campagnes.',
    'Quille Designs is an independent marketing and design studio. We work with businesses on brand identity, films and campaigns.': 'Quille Designs is een onafhankelijk marketing- en ontwerpbureau. We werken met bedrijven aan hun merkidentiteit, films en campagnes.',
    'See selected work': 'Bekijk geselecteerd werk',
    'In the collection': 'In de collectie',
    'Selected film': 'Geselecteerde film',
    'Design that tells a story.': 'Ontwerp dat een verhaal vertelt.',
    'Selected projects': 'Geselecteerde projecten',
    'Logo identities': 'Logo-identiteiten',
    'Films in motion': 'Films in beweging',
    'Creative services': 'Creatieve diensten',
    '[ 01 ] Selected work': '[ 01 ] Geselecteerd werk',
    'Selected work.': 'Geselecteerd werk.',
    'From the studio.': 'Uit de studio.',
    'Brand identities and films from our studio. View the designs in full or watch the films.': 'Merkidentiteiten en films uit onze studio. Bekijk de ontwerpen in hun geheel of speel de films af.',
    'All work': 'Al het werk',
    'Films': 'Films',
    'Identities': 'Merkidentiteiten',
    'Pause previews': 'Voorvertoningen pauzeren',
    'Resume previews': 'Voorvertoningen hervatten',
    'Commercial': 'Reclamefilm',
    'EV financing, explained.': 'EV-financiering uitgelegd.',
    'Play film': 'Film afspelen',
    'A film with a twist.': 'Een film met een onverwachte wending.',
    'See the security cameras in action.': 'Bekijk de beveiligingscamera’s in actie.',
    'Original identity': 'Originele identiteit',
    'Logo design & visual identity.': 'Logo-ontwerp & visuele identiteit.',
    'View artwork': 'Bekijk het ontwerp',
    '10 projects': '10 projecten',
    'Discuss your next project': 'Bespreek je volgende project',
    '[ 02 ] Capabilities': '[ 02 ] Expertise',
    'Brand identity & logo design': 'Merkidentiteit & logo-ontwerp',
    'Design for every part': 'Ontwerp voor elk onderdeel',
    'of your brand.': 'van je merk.',
    'We design logos and visual identities that fit your business and are easy to recognise.': 'We ontwerpen logo’s en visuele identiteiten die bij je bedrijf passen en je bedrijf herkenbaar maken.',
    'Logo design · Colour · Typography': 'Logo-ontwerp · Kleur · Typografie',
    'Flyer & poster design': 'Flyer- en posterontwerp',
    'Flyers, posters and brochures for events, promotions or launches, ready for print.': 'Flyers, posters en brochures voor evenementen, acties of lanceringen, klaar voor de drukker.',
    'Flyers · Posters · Brochures': 'Flyers · Posters · Brochures',
    'Advertising design': 'Advertentieontwerp',
    'We design ads for print and digital that make your offer easy to understand.': 'We ontwerpen advertenties voor print en online die meteen duidelijk maken wat je aanbiedt.',
    'Social ads · Banners · Billboards': 'Social advertenties · Banners · Billboards',
    'We plan, design and publish your posts, so your social channels stay active while you focus on the business.': 'We plannen, ontwerpen en plaatsen je berichten. Zo blijven je socialmediakanalen actief terwijl jij je bedrijf runt.',
    'Content · Scheduling · Insights': 'Content · Inplannen · Inzichten',
    'Bring us an idea. We’ll help you shape it.': 'Vertel ons je idee. We denken met je mee.',
    'Explore our services': 'Bekijk onze diensten',
    '[ 03 ] Our approach': '[ 03 ] Onze aanpak',
    'Strategy + craft': 'Strategie + vakmanschap',
    'Good marketing starts with': 'Goede marketing begint met',
    'a clear idea.': 'een helder idee.',
    'We turn that idea into a brand people recognise and remember.': 'We vertalen dat idee naar een merk dat mensen herkennen en onthouden.',
    'Quille Designs / Our manifesto': 'Quille Designs / Ons manifest',
    'A clear first impression.': 'Een heldere eerste indruk.',
    'A visual identity shaped around the way your business works.': 'Een visuele identiteit die past bij de manier waarop je bedrijf werkt.',
    'A story worth watching.': 'Een verhaal dat je wilt zien.',
    'Films that explain your product and give people a reason to keep watching.': 'Films die je product uitleggen en de aandacht vasthouden.',
    'A brand that sounds like itself.': 'Een merk met een eigen stem.',
    'We keep your brand recognisable wherever people come across it.': 'We zorgen dat je merk herkenbaar blijft, waar mensen het ook tegenkomen.',
    '[ 04 ] Start here': '[ 04 ] Begin hier',
    'What are you': 'Waar',
    'working on?': 'werk je aan?',
    'Tell us what you’re trying to do. We’ll ask a few questions and suggest a next step.': 'Vertel ons wat je wilt bereiken. We stellen een paar vragen en denken mee over een vervolgstap.',
    'Drop us a note.': 'Stuur ons een bericht.',
    'Send us your brief': 'Stuur ons je briefing',
    'Tell us what you have in mind. We’ll take it from there.': 'Vertel ons wat je in gedachten hebt. Dan kijken we samen verder.',
    'Clients': 'Klanten',
    'Brand Identity': 'Merkidentiteit',
    'Web Design': 'Webdesign',
    'SEO': 'SEO',
    'Selected work': 'Geselecteerd werk',
    'Video': 'Video',
    'Complete original artwork': 'Volledig origineel ontwerp',
    'Open original ↗': 'Open het origineel ↗',
    'Open video ↗': 'Open video ↗',
    'Loading video…': 'Video laden…',
    'Loading artwork…': 'Ontwerp laden…',
    'The video could not be loaded. Try “Open video” below.': 'De video kan niet worden geladen. Probeer hieronder “Open video”.',
    'This artwork could not be loaded. Try the “Open original” link below.': 'Dit ontwerp kan niet worden geladen. Probeer hieronder de link “Open het origineel”.',
    'Buffering video…': 'Video bufferen…',
    'The video is taking longer to load. You can also use “Open video” below.': 'Het laden van de video duurt langer. Je kunt ook hieronder “Open video” kiezen.',
    'Press play to start the video.': 'Druk op afspelen om de video te starten.',
    'Pause project ticker': 'Projectcarrousel pauzeren',
    'Resume project ticker': 'Projectcarrousel hervatten',
    'Filter selected work': 'Geselecteerd werk filteren',
    'Watch Mage EV video': 'Bekijk de video van Mage EV',
    'Watch Fake Alexa video': 'Bekijk de video van Fake Alexa',
    'Watch Baby video': 'Bekijk de video van Baby',
    'Previous project view': 'Vorige projectweergave',
    'Next project view': 'Volgende projectweergave',
    'Close viewer': 'Viewer sluiten',
    'Switch language to English': 'Wissel de taal naar Engels',
    'Switch language to Dutch': 'Wissel de taal naar Nederlands',
    'Quille Designs home': 'Quille Designs startpagina',
    'Primary': 'Hoofdnavigatie',
    'Open menu': 'Menu openen',
    'Close menu': 'Menu sluiten',
    'Mobile': 'Mobiele navigatie',
    'Disciplines': 'Specialismen',
    'Identity services': 'Diensten voor merkidentiteit',
    'Print services': 'Diensten voor drukwerk',
    'Campaigns services': 'Diensten voor campagnes',
    'Social services': 'Diensten voor social media',
    'Concept projects, scroll horizontally to explore': 'Conceptprojecten, scroll horizontaal om ze te bekijken',
    'Morrow Coffee concept: a brown serif wordmark on soft green, applied to a folded coffee bag.': 'Concept voor Morrow Coffee: een bruin schreeflogo op zachtgroen, toegepast op een gevouwen koffiezak.',
    'After Hours concept: an orange and indigo event poster with oversized lettering, shown flat or pasted to a street wall.': 'Concept voor After Hours: een oranje en indigo evenementposter met grote letters, plat getoond of op een muur geplakt.',
    'Forma Studio concept: lavender, peach and sage social campaign tiles, applied to a phone feed and a floating post.': 'Concept voor Forma Studio: lavendel-, perzik- en saliegroene socialcampagnebeelden op een telefoonfeed en een zwevende post.',
    'Trusted brands': 'Merken die ons vertrouwen',
    'Portfolio at a glance': 'Het portfolio in het kort',
    'Projects in the collection': 'Projecten in de collectie',
    'View complete Yuchel Solutions poster': 'Volledige poster van Yuchel Solutions bekijken',
    'Yuchel Solutions logo design poster with a green gear emblem, pricing and contact information': 'Logo-ontwerpposter van Yuchel Solutions met een groen tandwiel, prijzen en contactgegevens',
    'View complete Surinova poster': 'Volledige poster van Surinova bekijken',
    'Surinova logo design poster with a heartbeat and star symbol, pricing and contact information': 'Logo-ontwerpposter van Surinova met een hartslag- en sterteken, prijzen en contactgegevens',
    'View complete Raz Juices & More poster': 'Volledige poster van Raz Juices & More bekijken',
    'Raz Juices and More logo design poster with a leaf and colored ribbons, pricing and contact information': 'Logo-ontwerpposter van Raz Juices & More met een blad en gekleurde linten, prijzen en contactgegevens',
    'View complete Sranang Basi poster': 'Volledige poster van Sranang Basi bekijken',
    'Sranang Basi black and white monogram logo design poster with pricing and contact information': 'Zwart-witte logo-ontwerpposter van Sranang Basi met monogram, prijzen en contactgegevens',
    'View complete For The Love Of Pastry poster': 'Volledige poster van For The Love Of Pastry bekijken',
    'For The Love Of Pastry pastel cake logo design poster with pricing and contact information': 'Pastelkleurige logo-ontwerpposter van For The Love Of Pastry met taartillustratie, prijzen en contactgegevens',
    'View complete RH Meat Co. poster': 'Volledige poster van RH Meat Co. bekijken',
    'RH Meat Co. black and white animal monogram logo design poster with pricing and contact information': 'Zwart-witte logo-ontwerpposter van RH Meat Co. met dierenmonogram, prijzen en contactgegevens',
    'View complete Samtrade Global Impex poster': 'Volledige poster van Samtrade Global Impex bekijken',
    'Samtrade Global Impex red transport logo design poster with pricing and contact information': 'Rode transportlogo-ontwerpposter van Samtrade Global Impex met prijzen en contactgegevens',
    'A scene from the Mage EV financing film': 'Een scène uit de financieringsfilm van Mage EV',
    'Mage EV financing film showing a conversation about electric vehicles': 'Financieringsfilm van Mage EV met een gesprek over elektrische auto’s',
    'Fake Alexa film showing a technician inspecting an indoor unit': 'Fake Alexa-film met een monteur die een binnenunit inspecteert',
    'Baby film showing a presenter holding security cameras': 'Baby-film met een presentator die beveiligingscamera’s vasthoudt',
    'The complete Sranang Basi brand identity poster': 'De volledige merkidentiteitsposter van Sranang Basi',
    'Quille Designs logo': 'Logo van Quille Designs'
  }));

  const dutchToEnglish = new Map([...englishToDutch].map(([english, dutch]) => [dutch, english]));
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  let activeLanguage = 'nl';

  const manifestoCopy = {
    en: 'Good marketing starts with a clear idea. We turn that idea into a brand people recognise and remember.',
    nl: 'Goede marketing begint met een helder idee. We vertalen dat idee naar een merk dat mensen herkennen en onthouden.'
  };

  function translateValue(value, language) {
    const text = normalize(value);
    const dictionary = language === 'nl' ? englishToDutch : dutchToEnglish;
    if (dictionary.has(text)) return dictionary.get(text);

    let match;
    if (language === 'nl') {
      if ((match = text.match(/^Thanks (.+)\. We'll be in touch within one business day\.$/))) return `Bedankt, ${match[1]}. We nemen binnen één werkdag contact met je op.`;
      if ((match = text.match(/^(\d+) projects?$/i))) return `${match[1]} ${match[1] === '1' ? 'project' : 'projecten'}`;
      if ((match = text.match(/^View (\d+) of (\d+)$/))) return `Weergave ${match[1]} van ${match[2]}`;
      if ((match = text.match(/^Show mockup for (.+)$/))) return `Mock-up tonen voor ${match[1]}`;
      if ((match = text.match(/^Show artwork for (.+)$/))) return `Ontwerp tonen voor ${match[1]}`;
      if ((match = text.match(/^View complete (.+) poster$/))) return `Volledige poster van ${match[1]} bekijken`;
      if ((match = text.match(/^(.+) video$/))) return `Video van ${match[1]}`;
    } else {
      if ((match = text.match(/^Bedankt, (.+)\. We nemen binnen één werkdag contact met je op\.$/))) return `Thanks ${match[1]}. We'll be in touch within one business day.`;
      if ((match = text.match(/^(\d+) projecten?$/i))) return `${match[1]} ${match[1] === '1' ? 'project' : 'projects'}`;
      if ((match = text.match(/^Weergave (\d+) van (\d+)$/))) return `View ${match[1]} of ${match[2]}`;
      if ((match = text.match(/^Mock-up tonen voor (.+)$/))) return `Show mockup for ${match[1]}`;
      if ((match = text.match(/^Ontwerp tonen voor (.+)$/))) return `Show artwork for ${match[1]}`;
      if ((match = text.match(/^Volledige poster van (.+) bekijken$/))) return `View complete ${match[1]} poster`;
      if ((match = text.match(/^Video van (.+)$/))) return `${match[1]} video`;
    }
    return null;
  }

  function shouldSkipText(node) {
    const parent = node.parentElement;
    return !parent || !!parent.closest('script,style,#scrubText,.showcase-art,.showcase-mockup,[data-marquee]');
  }

  function localizeTextNode(node, language) {
    if (shouldSkipText(node)) return;
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = translateValue(trimmed, language);
    if (translated === null || translated === trimmed) return;
    const start = original.search(/\S/);
    const end = original.search(/\s*$/);
    node.nodeValue = original.slice(0, start) + translated + original.slice(end);
  }

  const translatedAttributes = ['aria-label', 'alt', 'placeholder', 'title', 'content', 'data-label'];
  function localizeAttribute(element, name, language) {
    if (!translatedAttributes.includes(name)) return;
    const value = element.getAttribute(name);
    if (!value) return;
    const translated = translateValue(value, language);
    if (translated !== null && translated !== value) element.setAttribute(name, translated);
  }

  function localizeSubtree(root, language) {
    if (root.nodeType === Node.TEXT_NODE) {
      localizeTextNode(root, language);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root !== document.body) return;
    const element = root.nodeType === Node.ELEMENT_NODE ? root : null;
    if (element && element.closest('script,style,.showcase-art,.showcase-mockup,[data-marquee]')) return;
    if (element) translatedAttributes.forEach(name => localizeAttribute(element, name, language));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) localizeTextNode(node, language);
    if (element) element.querySelectorAll(translatedAttributes.map(name => `[${name}]`).join(',')).forEach(child => {
      if (!child.closest('.showcase-art,.showcase-mockup,[data-marquee]')) translatedAttributes.forEach(name => localizeAttribute(child, name, language));
    });
  }

  function updateLanguageControls(language) {
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.setAttribute('aria-label', language === 'nl' ? 'Wissel de taal naar Engels' : 'Switch language to Dutch');
      button.querySelectorAll('[data-language-option]').forEach(option => {
        option.classList.toggle('is-active', option.dataset.languageOption === language);
      });
    });
  }

  function setLanguage(language, persist = true) {
    activeLanguage = language === 'en' ? 'en' : 'nl';
    document.documentElement.lang = activeLanguage;
    localizeSubtree(document.body, activeLanguage);

    const title = document.querySelector('title');
    if (title) {
      const translatedTitle = translateValue(title.textContent, activeLanguage);
      if (translatedTitle !== null) title.textContent = translatedTitle;
    }
    document.querySelectorAll('meta[name="description"]').forEach(meta => localizeAttribute(meta, 'content', activeLanguage));

    const manifesto = document.getElementById('scrubText');
    if (manifesto) {
      manifesto.textContent = manifestoCopy[activeLanguage];
      window.quilleRefreshScrubText?.();
    }

    updateLanguageControls(activeLanguage);
    if (persist) {
      try { localStorage.setItem('quille-language', activeLanguage); } catch (_) { /* Storage can be disabled. */ }
    }
    document.dispatchEvent(new CustomEvent('quille-language-change', { detail: { language: activeLanguage } }));
  }

  let savedLanguage = 'nl';
  try {
    const saved = localStorage.getItem('quille-language');
    if (saved === 'en' || saved === 'nl') savedLanguage = saved;
  } catch (_) { /* Use Dutch as the default when storage is unavailable. */ }
  setLanguage(savedLanguage, false);

  document.querySelectorAll('[data-language-toggle]').forEach(button => {
    button.addEventListener('click', () => setLanguage(activeLanguage === 'nl' ? 'en' : 'nl'));
  });

  const observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'characterData') localizeTextNode(record.target, activeLanguage);
      else if (record.type === 'attributes') localizeAttribute(record.target, record.attributeName, activeLanguage);
      else record.addedNodes.forEach(node => localizeSubtree(node, activeLanguage));
    });
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: translatedAttributes
  });

  window.quilleLanguage = {
    get: () => activeLanguage,
    set: setLanguage
  };
})();
