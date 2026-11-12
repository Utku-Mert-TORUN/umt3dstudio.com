/* Umt3D Studio — cost & quote calculator logic. Runs entirely client-side. */
(function(){
"use strict";

/* ---------------- i18n ---------------- */
var STR = {
  tr:{
    eyebrow:"OTOMATİK FİYATLANDIRMA",
    heroTitle:"Baskıyı yükle, fiyatı al.",
    heroSub:"G-code dosyanı sürükle, malzeme ve yazıcını seç — gram, süre ve watt bilgisini sen yazmana gerek kalmadan dolduralım. Geri kalan ayarları bir kez gir, tarayıcın hatırlasın.",
    h1t:"Dosya ile otomatik doldur", h1s:"Cura, PrusaSlicer, OrcaSlicer, Bambu Studio veya Simplify3D çıktısı .gcode / .bgcode / .gco dosyaları desteklenir.",
    dropT1:"G-code dosyasını buraya bırak", dropT2:"ya da tıklayıp seç — hiçbir şey sunucuya yüklenmez, her şey tarayıcında kalır",
    h2t:"Baskı türü, malzeme, yazıcı", h2s:"Yoğunluk ve güç tüketimi otomatik gelir, istersen üzerine yaz.",
    modeFdm:"FDM (Filament)", modeResin:"Reçine (Resin)",
    lblMaterial:"Malzeme", lblPrinter:"Yazıcı", lblWeight:"Filament ağırlığı", lblDensity:"Yoğunluk",
    lblFilPrice:"Filament fiyatı", lblWatt:"Yazıcı gücü", lblResinVol:"Reçine hacmi", lblResinPrice:"Reçine fiyatı",
    lblResinWatt:"Yazıcı + UV küvet gücü", lblConsumables:"Sarf malzeme (IPA, eldiven vb.)",
    lblResinMaterial:"Reçine türü", lblResinPrinter:"Reçine yazıcısı",
    lblBrand:"Marka (opsiyonel)", brandPh:"örn. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Renk",
    lblTime:"Baskı süresi", unitH:"sa", unitM:"dk", lblElec:"Elektrik birim fiyatı",
    h3t:"İşletme maliyetleri", h3s:"Bu bölüm tarayıcında saklanır, bir daha girmen gerekmez.",
    lblFail:"Fire / başarısız baskı payı", lblPost:"Son işlem / işçilik maliyeti",
    lblLaborRate:"Saatlik emek ücreti", lblLaborTime:"Harcanan emek süresi", unitMin:"dk",
    depToggle:"Yazıcı amortismanı ekle", depToggleSub:"Makine aşınma payını maliyete dahil et",
    lblPrinterCost:"Yazıcı maliyeti", lblLifetime:"Beklenen ömür", unitHours:"saat",
    lblMargin:"Kâr marjı", lblFx:"Döviz kuru (₺ başına)",
    ticketTitle:"Maliyet Fişi", btnQuote:"Müşteri Teklifi Oluştur", savedMsg:"Ayarların kaydedildi",
    quoteHeadTitle:"Teklif Bilgileri", lblBizName:"İşletme adı", lblCustName:"Müşteri adı", lblPartName:"Parça / proje adı",
    btnCopy:"📋 Panoya Kopyala", footer:"Tüm hesaplamalar tarayıcında yapılır, hiçbir veri sunucuya gönderilmez.",
    rowMaterial:"Malzeme maliyeti", rowElec:"Elektrik maliyeti", rowFail:"Fire payı", rowPost:"Son işlem / işçilik",
    rowDep:"Makine amortismanı", rowSubtotal:"Ara toplam (maliyet)", rowMargin:"Kâr marjı", rowTotal:"Müşteriye Fiyat",
    noFile:"Dosya tespit edilemedi, verileri elle gir.", fileOkWeight:"gram", fileOkTime:"süre",
    parsedBoth:"dosyadan okundu:", parsedPartial:"kısmen okundu, eksikleri elle tamamla:",
    parsedNone:"Bu dosyada tanınan bir slicer imzası bulunamadı. Gram ve süreyi elle girebilirsin.",
    fxMissing:"Kur girilmedi, tutarlar ₺ olarak gösteriliyor.",
    auto:"otomatik", quoteCopied:"Teklif panoya kopyalandı ✓", perHour:"/sa", qtyLabel:"adet",
    dateLocale:"tr-TR"
  },
  en:{
    eyebrow:"AUTOMATED PRICING",
    heroTitle:"Upload the print, get the price.",
    heroSub:"Drop your G-code, pick your material and printer — we fill in weight, time and wattage so you don't have to type them. Set the rest once and your browser remembers it.",
    h1t:"Auto-fill from a file", h1s:"Supports .gcode / .bgcode / .gco output from Cura, PrusaSlicer, OrcaSlicer, Bambu Studio or Simplify3D.",
    dropT1:"Drop your G-code file here", dropT2:"or click to browse — nothing is uploaded, everything stays in your browser",
    h2t:"Print type, material, printer", h2s:"Density and power draw fill in automatically — override if you like.",
    modeFdm:"FDM (Filament)", modeResin:"Resin",
    lblMaterial:"Material", lblPrinter:"Printer", lblWeight:"Filament weight", lblDensity:"Density",
    lblFilPrice:"Filament price", lblWatt:"Printer power", lblResinVol:"Resin volume", lblResinPrice:"Resin price",
    lblResinWatt:"Printer + UV tank power", lblConsumables:"Consumables (IPA, gloves, etc.)",
    lblResinMaterial:"Resin type", lblResinPrinter:"Resin printer",
    lblBrand:"Brand (optional)", brandPh:"e.g. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Color",
    lblTime:"Print time", unitH:"h", unitM:"min", lblElec:"Electricity rate",
    h3t:"Business costs", h3s:"This section is saved in your browser — you won't need to enter it again.",
    lblFail:"Failure / waste allowance", lblPost:"Post-processing / finishing cost",
    lblLaborRate:"Hourly labor rate", lblLaborTime:"Labor time spent", unitMin:"min",
    depToggle:"Add printer depreciation", depToggleSub:"Include machine wear in the cost",
    lblPrinterCost:"Printer cost", lblLifetime:"Expected lifetime", unitHours:"hours",
    lblMargin:"Profit margin", lblFx:"Exchange rate (per ₺)",
    ticketTitle:"Cost Ticket", btnQuote:"Create Customer Quote", savedMsg:"Settings saved",
    quoteHeadTitle:"Quote Details", lblBizName:"Business name", lblCustName:"Customer name", lblPartName:"Part / project name",
    btnCopy:"📋 Copy to Clipboard", footer:"All calculations run in your browser — no data is sent anywhere.",
    rowMaterial:"Material cost", rowElec:"Electricity cost", rowFail:"Failure allowance", rowPost:"Post-processing / labor",
    rowDep:"Machine depreciation", rowSubtotal:"Subtotal (cost)", rowMargin:"Profit margin", rowTotal:"Customer Price",
    noFile:"Couldn't detect file data, enter values manually.", fileOkWeight:"grams", fileOkTime:"time",
    parsedBoth:"read from file:", parsedPartial:"partially read, fill in the rest manually:",
    parsedNone:"No recognized slicer signature found in this file. You can enter weight and time manually.",
    fxMissing:"No exchange rate set — amounts are shown in ₺.",
    auto:"auto", quoteCopied:"Quote copied to clipboard ✓", perHour:"/hr", qtyLabel:"qty",
    dateLocale:"en-US"
  },
  de:{
    eyebrow:"AUTOMATISCHE PREISBERECHNUNG",
    heroTitle:"Druck hochladen, Preis erhalten.",
    heroSub:"Lade deine G-Code-Datei hoch, wähle Material und Drucker — Gewicht, Zeit und Leistung werden automatisch ausgefüllt. Restliche Einstellungen einmal eingeben, dein Browser merkt sie sich.",
    h1t:"Automatisch aus Datei ausfüllen", h1s:"Unterstützt .gcode / .bgcode / .gco Dateien von Cura, PrusaSlicer, OrcaSlicer, Bambu Studio oder Simplify3D.",
    dropT1:"G-Code-Datei hier ablegen", dropT2:"oder klicken zum Auswählen — nichts wird hochgeladen, alles bleibt im Browser",
    h2t:"Druckart, Material, Drucker", h2s:"Dichte und Stromverbrauch werden automatisch ausgefüllt — bei Bedarf überschreiben.",
    modeFdm:"FDM (Filament)", modeResin:"Harz (Resin)",
    lblMaterial:"Material", lblPrinter:"Drucker", lblWeight:"Filamentgewicht", lblDensity:"Dichte",
    lblFilPrice:"Filamentpreis", lblWatt:"Druckerleistung", lblResinVol:"Harzvolumen", lblResinPrice:"Harzpreis",
    lblResinWatt:"Drucker + UV-Wanne Leistung", lblConsumables:"Verbrauchsmaterial (IPA, Handschuhe usw.)",
    lblResinMaterial:"Harztyp", lblResinPrinter:"Harzdrucker",
    lblBrand:"Marke (optional)", brandPh:"z. B. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Farbe",
    lblTime:"Druckzeit", unitH:"Std", unitM:"Min", lblElec:"Strompreis",
    h3t:"Betriebskosten", h3s:"Dieser Bereich wird im Browser gespeichert — keine erneute Eingabe nötig.",
    lblFail:"Ausschuss-/Fehldruckanteil", lblPost:"Nachbearbeitungs-/Arbeitskosten",
    lblLaborRate:"Stundenlohn", lblLaborTime:"Aufgewendete Arbeitszeit", unitMin:"Min",
    depToggle:"Druckerabschreibung hinzufügen", depToggleSub:"Maschinenverschleiß in die Kosten einbeziehen",
    lblPrinterCost:"Druckerkosten", lblLifetime:"Erwartete Lebensdauer", unitHours:"Stunden",
    lblMargin:"Gewinnmarge", lblFx:"Wechselkurs (pro ₺)",
    ticketTitle:"Kostenbeleg", btnQuote:"Kundenangebot erstellen", savedMsg:"Einstellungen gespeichert",
    quoteHeadTitle:"Angebotsdetails", lblBizName:"Firmenname", lblCustName:"Kundenname", lblPartName:"Teil-/Projektname",
    btnCopy:"📋 In Zwischenablage kopieren", footer:"Alle Berechnungen laufen im Browser — keine Daten werden gesendet.",
    rowMaterial:"Materialkosten", rowElec:"Stromkosten", rowFail:"Ausschussanteil", rowPost:"Nachbearbeitung / Arbeit",
    rowDep:"Maschinenabschreibung", rowSubtotal:"Zwischensumme (Kosten)", rowMargin:"Gewinnmarge", rowTotal:"Kundenpreis",
    noFile:"Keine Dateidaten erkannt, bitte manuell eingeben.", fileOkWeight:"Gramm", fileOkTime:"Zeit",
    parsedBoth:"aus Datei gelesen:", parsedPartial:"teilweise gelesen, Rest manuell ergänzen:",
    parsedNone:"Keine erkannte Slicer-Signatur in dieser Datei. Gewicht und Zeit können manuell eingegeben werden.",
    fxMissing:"Kein Wechselkurs eingegeben — Beträge werden in ₺ angezeigt.",
    auto:"automatisch", quoteCopied:"Angebot kopiert ✓", perHour:"/Std", qtyLabel:"Menge",
    dateLocale:"de-DE"
  },
  fr:{
    eyebrow:"TARIFICATION AUTOMATIQUE",
    heroTitle:"Téléchargez l'impression, obtenez le prix.",
    heroSub:"Glissez votre fichier G-code, choisissez le matériau et l'imprimante — le poids, la durée et la puissance se remplissent automatiquement. Réglez le reste une fois, votre navigateur s'en souvient.",
    h1t:"Remplissage automatique depuis un fichier", h1s:"Prend en charge les fichiers .gcode / .bgcode / .gco issus de Cura, PrusaSlicer, OrcaSlicer, Bambu Studio ou Simplify3D.",
    dropT1:"Déposez votre fichier G-code ici", dropT2:"ou cliquez pour parcourir — rien n'est envoyé, tout reste dans le navigateur",
    h2t:"Type d'impression, matériau, imprimante", h2s:"La densité et la consommation électrique se remplissent automatiquement — modifiables si besoin.",
    modeFdm:"FDM (Filament)", modeResin:"Résine",
    lblMaterial:"Matériau", lblPrinter:"Imprimante", lblWeight:"Poids du filament", lblDensity:"Densité",
    lblFilPrice:"Prix du filament", lblWatt:"Puissance de l'imprimante", lblResinVol:"Volume de résine", lblResinPrice:"Prix de la résine",
    lblResinWatt:"Puissance imprimante + bac UV", lblConsumables:"Consommables (IPA, gants, etc.)",
    lblResinMaterial:"Type de résine", lblResinPrinter:"Imprimante résine",
    lblBrand:"Marque (facultatif)", brandPh:"ex. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Couleur",
    lblTime:"Temps d'impression", unitH:"h", unitM:"min", lblElec:"Tarif électrique",
    h3t:"Coûts d'exploitation", h3s:"Cette section est enregistrée dans le navigateur — à ne saisir qu'une fois.",
    lblFail:"Marge d'échec / rebut", lblPost:"Coût de post-traitement / main-d'œuvre",
    lblLaborRate:"Taux horaire", lblLaborTime:"Temps de main-d'œuvre", unitMin:"min",
    depToggle:"Ajouter l'amortissement de l'imprimante", depToggleSub:"Inclure l'usure de la machine dans le coût",
    lblPrinterCost:"Coût de l'imprimante", lblLifetime:"Durée de vie prévue", unitHours:"heures",
    lblMargin:"Marge bénéficiaire", lblFx:"Taux de change (par ₺)",
    ticketTitle:"Ticket de coût", btnQuote:"Créer un devis client", savedMsg:"Paramètres enregistrés",
    quoteHeadTitle:"Détails du devis", lblBizName:"Nom de l'entreprise", lblCustName:"Nom du client", lblPartName:"Nom de la pièce / du projet",
    btnCopy:"📋 Copier dans le presse-papiers", footer:"Tous les calculs s'exécutent dans le navigateur — aucune donnée n'est envoyée.",
    rowMaterial:"Coût du matériau", rowElec:"Coût électrique", rowFail:"Marge d'échec", rowPost:"Post-traitement / main-d'œuvre",
    rowDep:"Amortissement machine", rowSubtotal:"Sous-total (coût)", rowMargin:"Marge bénéficiaire", rowTotal:"Prix client",
    noFile:"Aucune donnée détectée, saisissez les valeurs manuellement.", fileOkWeight:"grammes", fileOkTime:"durée",
    parsedBoth:"lu depuis le fichier :", parsedPartial:"lu partiellement, complétez le reste manuellement :",
    parsedNone:"Aucune signature de slicer reconnue dans ce fichier. Vous pouvez saisir le poids et la durée manuellement.",
    fxMissing:"Aucun taux de change saisi — montants affichés en ₺.",
    auto:"automatique", quoteCopied:"Devis copié ✓", perHour:"/h", qtyLabel:"qté",
    dateLocale:"fr-FR"
  },
  es:{
    eyebrow:"PRECIOS AUTOMÁTICOS",
    heroTitle:"Sube la impresión, obtén el precio.",
    heroSub:"Arrastra tu archivo G-code, elige material e impresora — el peso, el tiempo y la potencia se completan solos. Configura el resto una vez, tu navegador lo recuerda.",
    h1t:"Autocompletar desde un archivo", h1s:"Admite archivos .gcode / .bgcode / .gco de Cura, PrusaSlicer, OrcaSlicer, Bambu Studio o Simplify3D.",
    dropT1:"Suelta aquí tu archivo G-code", dropT2:"o haz clic para buscar — nada se sube, todo permanece en tu navegador",
    h2t:"Tipo de impresión, material, impresora", h2s:"La densidad y el consumo se completan automáticamente — edítalos si lo deseas.",
    modeFdm:"FDM (Filamento)", modeResin:"Resina",
    lblMaterial:"Material", lblPrinter:"Impresora", lblWeight:"Peso del filamento", lblDensity:"Densidad",
    lblFilPrice:"Precio del filamento", lblWatt:"Potencia de la impresora", lblResinVol:"Volumen de resina", lblResinPrice:"Precio de la resina",
    lblResinWatt:"Potencia impresora + tanque UV", lblConsumables:"Consumibles (IPA, guantes, etc.)",
    lblResinMaterial:"Tipo de resina", lblResinPrinter:"Impresora de resina",
    lblBrand:"Marca (opcional)", brandPh:"ej. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Color",
    lblTime:"Tiempo de impresión", unitH:"h", unitM:"min", lblElec:"Tarifa eléctrica",
    h3t:"Costos operativos", h3s:"Esta sección se guarda en el navegador — no necesitas volver a ingresarla.",
    lblFail:"Margen de fallos / desperdicio", lblPost:"Costo de posprocesado / mano de obra",
    lblLaborRate:"Tarifa por hora", lblLaborTime:"Tiempo de mano de obra", unitMin:"min",
    depToggle:"Añadir depreciación de la impresora", depToggleSub:"Incluir el desgaste de la máquina en el costo",
    lblPrinterCost:"Costo de la impresora", lblLifetime:"Vida útil esperada", unitHours:"horas",
    lblMargin:"Margen de ganancia", lblFx:"Tipo de cambio (por ₺)",
    ticketTitle:"Ticket de costo", btnQuote:"Crear presupuesto para cliente", savedMsg:"Ajustes guardados",
    quoteHeadTitle:"Detalles del presupuesto", lblBizName:"Nombre del negocio", lblCustName:"Nombre del cliente", lblPartName:"Nombre de la pieza / proyecto",
    btnCopy:"📋 Copiar al portapapeles", footer:"Todos los cálculos se ejecutan en el navegador — no se envían datos.",
    rowMaterial:"Costo de material", rowElec:"Costo eléctrico", rowFail:"Margen de fallos", rowPost:"Posprocesado / mano de obra",
    rowDep:"Depreciación de máquina", rowSubtotal:"Subtotal (costo)", rowMargin:"Margen de ganancia", rowTotal:"Precio al cliente",
    noFile:"No se detectaron datos del archivo, ingresa los valores manualmente.", fileOkWeight:"gramos", fileOkTime:"tiempo",
    parsedBoth:"leído del archivo:", parsedPartial:"leído parcialmente, completa el resto manualmente:",
    parsedNone:"No se reconoció ninguna firma de slicer en este archivo. Puedes ingresar el peso y el tiempo manualmente.",
    fxMissing:"No se ingresó tipo de cambio — los montos se muestran en ₺.",
    auto:"automático", quoteCopied:"Presupuesto copiado ✓", perHour:"/h", qtyLabel:"cant.",
    dateLocale:"es-ES"
  },
  pt:{
    eyebrow:"PREÇOS AUTOMÁTICOS",
    heroTitle:"Envie a impressão, receba o preço.",
    heroSub:"Arraste seu arquivo G-code, escolha material e impressora — peso, tempo e potência são preenchidos automaticamente. Configure o resto uma vez, seu navegador lembra.",
    h1t:"Preenchimento automático por arquivo", h1s:"Suporta arquivos .gcode / .bgcode / .gco do Cura, PrusaSlicer, OrcaSlicer, Bambu Studio ou Simplify3D.",
    dropT1:"Solte seu arquivo G-code aqui", dropT2:"ou clique para procurar — nada é enviado, tudo fica no navegador",
    h2t:"Tipo de impressão, material, impressora", h2s:"Densidade e consumo de energia são preenchidos automaticamente — edite se quiser.",
    modeFdm:"FDM (Filamento)", modeResin:"Resina",
    lblMaterial:"Material", lblPrinter:"Impressora", lblWeight:"Peso do filamento", lblDensity:"Densidade",
    lblFilPrice:"Preço do filamento", lblWatt:"Potência da impressora", lblResinVol:"Volume de resina", lblResinPrice:"Preço da resina",
    lblResinWatt:"Potência impressora + cuba UV", lblConsumables:"Consumíveis (IPA, luvas, etc.)",
    lblResinMaterial:"Tipo de resina", lblResinPrinter:"Impressora de resina",
    lblBrand:"Marca (opcional)", brandPh:"ex. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Cor",
    lblTime:"Tempo de impressão", unitH:"h", unitM:"min", lblElec:"Tarifa de eletricidade",
    h3t:"Custos operacionais", h3s:"Esta seção é salva no navegador — não precisa inserir novamente.",
    lblFail:"Margem de falhas / desperdício", lblPost:"Custo de pós-processamento / mão de obra",
    lblLaborRate:"Valor por hora", lblLaborTime:"Tempo de mão de obra", unitMin:"min",
    depToggle:"Adicionar depreciação da impressora", depToggleSub:"Incluir o desgaste da máquina no custo",
    lblPrinterCost:"Custo da impressora", lblLifetime:"Vida útil esperada", unitHours:"horas",
    lblMargin:"Margem de lucro", lblFx:"Taxa de câmbio (por ₺)",
    ticketTitle:"Recibo de custo", btnQuote:"Criar orçamento para cliente", savedMsg:"Configurações salvas",
    quoteHeadTitle:"Detalhes do orçamento", lblBizName:"Nome da empresa", lblCustName:"Nome do cliente", lblPartName:"Nome da peça / projeto",
    btnCopy:"📋 Copiar para a área de transferência", footer:"Todos os cálculos rodam no navegador — nenhum dado é enviado.",
    rowMaterial:"Custo do material", rowElec:"Custo de eletricidade", rowFail:"Margem de falhas", rowPost:"Pós-processamento / mão de obra",
    rowDep:"Depreciação da máquina", rowSubtotal:"Subtotal (custo)", rowMargin:"Margem de lucro", rowTotal:"Preço ao cliente",
    noFile:"Nenhum dado de arquivo detectado, insira os valores manualmente.", fileOkWeight:"gramas", fileOkTime:"tempo",
    parsedBoth:"lido do arquivo:", parsedPartial:"lido parcialmente, complete o restante manualmente:",
    parsedNone:"Nenhuma assinatura de slicer reconhecida neste arquivo. Você pode inserir o peso e o tempo manualmente.",
    fxMissing:"Nenhuma taxa de câmbio inserida — valores exibidos em ₺.",
    auto:"automático", quoteCopied:"Orçamento copiado ✓", perHour:"/h", qtyLabel:"qtd.",
    dateLocale:"pt-BR"
  },
  it:{
    eyebrow:"PREZZI AUTOMATICI",
    heroTitle:"Carica la stampa, ottieni il prezzo.",
    heroSub:"Trascina il tuo file G-code, scegli materiale e stampante — peso, tempo e potenza si compilano da soli. Imposta il resto una volta, il browser lo ricorda.",
    h1t:"Compilazione automatica da file", h1s:"Supporta file .gcode / .bgcode / .gco da Cura, PrusaSlicer, OrcaSlicer, Bambu Studio o Simplify3D.",
    dropT1:"Rilascia qui il tuo file G-code", dropT2:"oppure clicca per sfogliare — nulla viene caricato, tutto resta nel browser",
    h2t:"Tipo di stampa, materiale, stampante", h2s:"Densità e consumo energetico si compilano automaticamente — modificabili se necessario.",
    modeFdm:"FDM (Filamento)", modeResin:"Resina",
    lblMaterial:"Materiale", lblPrinter:"Stampante", lblWeight:"Peso del filamento", lblDensity:"Densità",
    lblFilPrice:"Prezzo del filamento", lblWatt:"Potenza della stampante", lblResinVol:"Volume di resina", lblResinPrice:"Prezzo della resina",
    lblResinWatt:"Potenza stampante + vasca UV", lblConsumables:"Materiali di consumo (IPA, guanti, ecc.)",
    lblResinMaterial:"Tipo di resina", lblResinPrinter:"Stampante a resina",
    lblBrand:"Marca (opzionale)", brandPh:"es. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Colore",
    lblTime:"Tempo di stampa", unitH:"h", unitM:"min", lblElec:"Tariffa elettrica",
    h3t:"Costi operativi", h3s:"Questa sezione viene salvata nel browser — non serve inserirla di nuovo.",
    lblFail:"Margine di scarto / fallimenti", lblPost:"Costo di post-elaborazione / manodopera",
    lblLaborRate:"Tariffa oraria", lblLaborTime:"Tempo di manodopera", unitMin:"min",
    depToggle:"Aggiungi ammortamento stampante", depToggleSub:"Includi l'usura della macchina nel costo",
    lblPrinterCost:"Costo della stampante", lblLifetime:"Durata prevista", unitHours:"ore",
    lblMargin:"Margine di profitto", lblFx:"Tasso di cambio (per ₺)",
    ticketTitle:"Scontrino dei costi", btnQuote:"Crea preventivo cliente", savedMsg:"Impostazioni salvate",
    quoteHeadTitle:"Dettagli preventivo", lblBizName:"Nome dell'attività", lblCustName:"Nome del cliente", lblPartName:"Nome del pezzo / progetto",
    btnCopy:"📋 Copia negli appunti", footer:"Tutti i calcoli vengono eseguiti nel browser — nessun dato viene inviato.",
    rowMaterial:"Costo materiale", rowElec:"Costo elettrico", rowFail:"Margine di scarto", rowPost:"Post-elaborazione / manodopera",
    rowDep:"Ammortamento macchina", rowSubtotal:"Subtotale (costo)", rowMargin:"Margine di profitto", rowTotal:"Prezzo al cliente",
    noFile:"Nessun dato rilevato dal file, inserisci i valori manualmente.", fileOkWeight:"grammi", fileOkTime:"tempo",
    parsedBoth:"letto dal file:", parsedPartial:"letto parzialmente, completa il resto manualmente:",
    parsedNone:"Nessuna firma di slicer riconosciuta in questo file. Puoi inserire peso e tempo manualmente.",
    fxMissing:"Nessun tasso di cambio inserito — importi mostrati in ₺.",
    auto:"automatico", quoteCopied:"Preventivo copiato ✓", perHour:"/h", qtyLabel:"qtà",
    dateLocale:"it-IT"
  },
  ru:{
    eyebrow:"АВТОМАТИЧЕСКИЙ РАСЧЁТ ЦЕНЫ",
    heroTitle:"Загрузите печать, получите цену.",
    heroSub:"Перетащите файл G-code, выберите материал и принтер — вес, время и мощность заполнятся автоматически. Остальные настройки введите один раз, браузер запомнит их.",
    h1t:"Автозаполнение из файла", h1s:"Поддерживаются файлы .gcode / .bgcode / .gco из Cura, PrusaSlicer, OrcaSlicer, Bambu Studio или Simplify3D.",
    dropT1:"Перетащите сюда файл G-code", dropT2:"или нажмите, чтобы выбрать — ничего не отправляется на сервер, всё остаётся в браузере",
    h2t:"Тип печати, материал, принтер", h2s:"Плотность и энергопотребление заполняются автоматически — можно изменить.",
    modeFdm:"FDM (филамент)", modeResin:"Смола (Resin)",
    lblMaterial:"Материал", lblPrinter:"Принтер", lblWeight:"Вес филамента", lblDensity:"Плотность",
    lblFilPrice:"Цена филамента", lblWatt:"Мощность принтера", lblResinVol:"Объём смолы", lblResinPrice:"Цена смолы",
    lblResinWatt:"Мощность принтера + УФ-ванны", lblConsumables:"Расходники (спирт, перчатки и т.д.)",
    lblResinMaterial:"Тип смолы", lblResinPrinter:"Принтер для смолы",
    lblBrand:"Бренд (необязательно)", brandPh:"напр. eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"Цвет",
    lblTime:"Время печати", unitH:"ч", unitM:"мин", lblElec:"Тариф на электричество",
    h3t:"Операционные расходы", h3s:"Этот раздел сохраняется в браузере — вводить повторно не нужно.",
    lblFail:"Доля брака / неудачных печатей", lblPost:"Постобработка / стоимость труда",
    lblLaborRate:"Почасовая ставка", lblLaborTime:"Затраченное время труда", unitMin:"мин",
    depToggle:"Добавить амортизацию принтера", depToggleSub:"Учитывать износ устройства в стоимости",
    lblPrinterCost:"Стоимость принтера", lblLifetime:"Ожидаемый срок службы", unitHours:"часов",
    lblMargin:"Маржа прибыли", lblFx:"Курс обмена (за ₺)",
    ticketTitle:"Чек затрат", btnQuote:"Создать предложение клиенту", savedMsg:"Настройки сохранены",
    quoteHeadTitle:"Детали предложения", lblBizName:"Название компании", lblCustName:"Имя клиента", lblPartName:"Название детали / проекта",
    btnCopy:"📋 Копировать в буфер обмена", footer:"Все расчёты выполняются в браузере — данные никуда не отправляются.",
    rowMaterial:"Стоимость материала", rowElec:"Стоимость электричества", rowFail:"Доля брака", rowPost:"Постобработка / труд",
    rowDep:"Амортизация оборудования", rowSubtotal:"Промежуточный итог (затраты)", rowMargin:"Маржа прибыли", rowTotal:"Цена для клиента",
    noFile:"Данные файла не обнаружены, введите значения вручную.", fileOkWeight:"грамм", fileOkTime:"время",
    parsedBoth:"считано из файла:", parsedPartial:"считано частично, остальное заполните вручную:",
    parsedNone:"В этом файле не распознана подпись слайсера. Вес и время можно ввести вручную.",
    fxMissing:"Курс обмена не задан — суммы показаны в ₺.",
    auto:"авто", quoteCopied:"Предложение скопировано ✓", perHour:"/ч", qtyLabel:"кол-во",
    dateLocale:"ru-RU"
  },
  ar:{
    eyebrow:"تسعير تلقائي",
    heroTitle:"ارفع الطباعة، احصل على السعر.",
    heroSub:"اسحب ملف G-code، اختر المادة والطابعة — سيتم تعبئة الوزن والوقت والطاقة تلقائيًا. أدخل باقي الإعدادات مرة واحدة ويتذكرها المتصفح.",
    h1t:"تعبئة تلقائية من ملف", h1s:"يدعم ملفات .gcode / .bgcode / .gco الناتجة عن Cura وPrusaSlicer وOrcaSlicer وBambu Studio أو Simplify3D.",
    dropT1:"أفلت ملف G-code هنا", dropT2:"أو انقر للاختيار — لا يُرفع أي شيء، كل شيء يبقى في المتصفح",
    h2t:"نوع الطباعة، المادة، الطابعة", h2s:"تُعبأ الكثافة واستهلاك الطاقة تلقائيًا — يمكنك تعديلها.",
    modeFdm:"FDM (فيلامنت)", modeResin:"راتنج (Resin)",
    lblMaterial:"المادة", lblPrinter:"الطابعة", lblWeight:"وزن الفيلامنت", lblDensity:"الكثافة",
    lblFilPrice:"سعر الفيلامنت", lblWatt:"طاقة الطابعة", lblResinVol:"حجم الراتنج", lblResinPrice:"سعر الراتنج",
    lblResinWatt:"طاقة الطابعة + حوض الأشعة فوق البنفسجية", lblConsumables:"المواد المستهلكة (كحول، قفازات، إلخ)",
    lblResinMaterial:"نوع الراتنج", lblResinPrinter:"طابعة الراتنج",
    lblBrand:"العلامة التجارية (اختياري)", brandPh:"مثال: eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"اللون",
    lblTime:"مدة الطباعة", unitH:"س", unitM:"د", lblElec:"سعر الكهرباء",
    h3t:"تكاليف التشغيل", h3s:"يُحفظ هذا القسم في المتصفح — لا حاجة لإدخاله مرة أخرى.",
    lblFail:"نسبة الهدر / الطباعات الفاشلة", lblPost:"تكلفة المعالجة النهائية / العمالة",
    lblLaborRate:"أجر الساعة", lblLaborTime:"وقت العمل المستغرق", unitMin:"د",
    depToggle:"إضافة إهلاك الطابعة", depToggleSub:"تضمين تآكل الجهاز في التكلفة",
    lblPrinterCost:"تكلفة الطابعة", lblLifetime:"العمر المتوقع", unitHours:"ساعة",
    lblMargin:"هامش الربح", lblFx:"سعر الصرف (لكل ₺)",
    ticketTitle:"إيصال التكلفة", btnQuote:"إنشاء عرض سعر للعميل", savedMsg:"تم حفظ الإعدادات",
    quoteHeadTitle:"تفاصيل العرض", lblBizName:"اسم الشركة", lblCustName:"اسم العميل", lblPartName:"اسم القطعة / المشروع",
    btnCopy:"📋 نسخ إلى الحافظة", footer:"تتم جميع الحسابات في المتصفح — لا تُرسل أي بيانات.",
    rowMaterial:"تكلفة المادة", rowElec:"تكلفة الكهرباء", rowFail:"نسبة الهدر", rowPost:"المعالجة النهائية / العمالة",
    rowDep:"إهلاك الجهاز", rowSubtotal:"المجموع الفرعي (التكلفة)", rowMargin:"هامش الربح", rowTotal:"سعر العميل",
    noFile:"لم يتم اكتشاف بيانات الملف، أدخل القيم يدويًا.", fileOkWeight:"غرام", fileOkTime:"الوقت",
    parsedBoth:"تمت قراءته من الملف:", parsedPartial:"تمت قراءته جزئيًا، أكمل الباقي يدويًا:",
    parsedNone:"لم يتم التعرف على توقيع برنامج تقطيع في هذا الملف. يمكنك إدخال الوزن والوقت يدويًا.",
    fxMissing:"لم يُدخل سعر صرف — تُعرض المبالغ بالليرة التركية ₺.",
    auto:"تلقائي", quoteCopied:"تم نسخ العرض ✓", perHour:"/س", qtyLabel:"الكمية",
    dateLocale:"ar-SA"
  },
  zh:{
    eyebrow:"自动报价",
    heroTitle:"上传打印文件，立即获得价格。",
    heroSub:"拖入你的 G-code 文件，选择材料和打印机——重量、时间和功率会自动填写。其余设置只需输入一次，浏览器会记住。",
    h1t:"通过文件自动填写", h1s:"支持来自 Cura、PrusaSlicer、OrcaSlicer、Bambu Studio 或 Simplify3D 的 .gcode / .bgcode / .gco 文件。",
    dropT1:"将 G-code 文件拖放到此处", dropT2:"或点击选择——不会上传任何内容，一切都保留在浏览器中",
    h2t:"打印类型、材料、打印机", h2s:"密度和功耗会自动填写——可按需修改。",
    modeFdm:"FDM（线材）", modeResin:"树脂（Resin）",
    lblMaterial:"材料", lblPrinter:"打印机", lblWeight:"线材重量", lblDensity:"密度",
    lblFilPrice:"线材价格", lblWatt:"打印机功率", lblResinVol:"树脂体积", lblResinPrice:"树脂价格",
    lblResinWatt:"打印机 + UV 槽功率", lblConsumables:"耗材（酒精、手套等）",
    lblResinMaterial:"树脂类型", lblResinPrinter:"树脂打印机",
    lblBrand:"品牌（可选）", brandPh:"例如 eSUN、Polymaker、Prusament、Bambu Lab",
    lblColor:"颜色",
    lblTime:"打印时间", unitH:"小时", unitM:"分钟", lblElec:"电费单价",
    h3t:"运营成本", h3s:"此部分保存在浏览器中——无需重复输入。",
    lblFail:"废品/失败打印比例", lblPost:"后处理/人工成本",
    lblLaborRate:"每小时人工费", lblLaborTime:"所用人工时间", unitMin:"分钟",
    depToggle:"添加打印机折旧", depToggleSub:"将设备磨损计入成本",
    lblPrinterCost:"打印机成本", lblLifetime:"预期寿命", unitHours:"小时",
    lblMargin:"利润率", lblFx:"汇率（每 ₺）",
    ticketTitle:"成本单", btnQuote:"生成客户报价", savedMsg:"设置已保存",
    quoteHeadTitle:"报价详情", lblBizName:"企业名称", lblCustName:"客户名称", lblPartName:"零件/项目名称",
    btnCopy:"📋 复制到剪贴板", footer:"所有计算均在浏览器中完成——不发送任何数据。",
    rowMaterial:"材料成本", rowElec:"电费成本", rowFail:"废品比例", rowPost:"后处理/人工",
    rowDep:"设备折旧", rowSubtotal:"小计（成本）", rowMargin:"利润率", rowTotal:"客户价格",
    noFile:"未检测到文件数据，请手动输入。", fileOkWeight:"克", fileOkTime:"时间",
    parsedBoth:"已从文件读取：", parsedPartial:"部分读取，请手动补全：",
    parsedNone:"未在此文件中识别到切片软件签名。你可以手动输入重量和时间。",
    fxMissing:"未输入汇率——金额以 ₺ 显示。",
    auto:"自动", quoteCopied:"报价已复制 ✓", perHour:"/小时", qtyLabel:"数量",
    dateLocale:"zh-CN"
  },
  ja:{
    eyebrow:"自動価格計算",
    heroTitle:"プリントをアップロードして価格を取得。",
    heroSub:"G-codeファイルをドラッグし、材料とプリンターを選択——重量、時間、消費電力を自動入力します。残りの設定は一度入力すればブラウザが記憶します。",
    h1t:"ファイルから自動入力", h1s:"Cura、PrusaSlicer、OrcaSlicer、Bambu Studio、Simplify3D から出力された .gcode / .bgcode / .gco ファイルに対応。",
    dropT1:"G-codeファイルをここにドロップ", dropT2:"またはクリックして選択——何もアップロードされず、すべてブラウザ内に保持されます",
    h2t:"印刷タイプ、材料、プリンター", h2s:"密度と消費電力は自動入力されます——必要に応じて上書き可能です。",
    modeFdm:"FDM（フィラメント）", modeResin:"レジン",
    lblMaterial:"材料", lblPrinter:"プリンター", lblWeight:"フィラメント重量", lblDensity:"密度",
    lblFilPrice:"フィラメント価格", lblWatt:"プリンター消費電力", lblResinVol:"レジン量", lblResinPrice:"レジン価格",
    lblResinWatt:"プリンター + UV槽の消費電力", lblConsumables:"消耗品（IPA、手袋など）",
    lblResinMaterial:"レジンの種類", lblResinPrinter:"レジンプリンター",
    lblBrand:"ブランド（任意）", brandPh:"例: eSUN、Polymaker、Prusament、Bambu Lab",
    lblColor:"カラー",
    lblTime:"印刷時間", unitH:"時間", unitM:"分", lblElec:"電気料金単価",
    h3t:"運営コスト", h3s:"この項目はブラウザに保存され、再入力の必要はありません。",
    lblFail:"失敗・廃棄率", lblPost:"後処理・人件費コスト",
    lblLaborRate:"時給", lblLaborTime:"作業時間", unitMin:"分",
    depToggle:"プリンター減価償却を追加", depToggleSub:"機械の摩耗をコストに含める",
    lblPrinterCost:"プリンター費用", lblLifetime:"想定耐用時間", unitHours:"時間",
    lblMargin:"利益率", lblFx:"為替レート（₺あたり）",
    ticketTitle:"コスト明細", btnQuote:"顧客向け見積もりを作成", savedMsg:"設定を保存しました",
    quoteHeadTitle:"見積もり詳細", lblBizName:"事業者名", lblCustName:"顧客名", lblPartName:"部品・プロジェクト名",
    btnCopy:"📋 クリップボードにコピー", footer:"すべての計算はブラウザ内で行われ、データは送信されません。",
    rowMaterial:"材料費", rowElec:"電気代", rowFail:"失敗率", rowPost:"後処理・人件費",
    rowDep:"機械減価償却", rowSubtotal:"小計（原価）", rowMargin:"利益率", rowTotal:"顧客価格",
    noFile:"ファイルデータを検出できませんでした。手動で入力してください。", fileOkWeight:"グラム", fileOkTime:"時間",
    parsedBoth:"ファイルから読み取り：", parsedPartial:"一部読み取り、残りは手動で入力してください：",
    parsedNone:"このファイルに認識可能なスライサー署名が見つかりませんでした。重量と時間を手動で入力できます。",
    fxMissing:"為替レートが未入力です——金額は₺で表示されます。",
    auto:"自動", quoteCopied:"見積もりをコピーしました ✓", perHour:"/時", qtyLabel:"数量",
    dateLocale:"ja-JP"
  },
  ko:{
    eyebrow:"자동 가격 계산",
    heroTitle:"출력물을 업로드하고 가격을 받아보세요.",
    heroSub:"G-code 파일을 드래그하고 소재와 프린터를 선택하세요 — 무게, 시간, 전력이 자동으로 채워집니다. 나머지 설정은 한 번만 입력하면 브라우저가 기억합니다.",
    h1t:"파일로 자동 입력", h1s:"Cura, PrusaSlicer, OrcaSlicer, Bambu Studio, Simplify3D에서 출력된 .gcode / .bgcode / .gco 파일을 지원합니다.",
    dropT1:"G-code 파일을 여기에 놓으세요", dropT2:"또는 클릭하여 선택 — 아무것도 업로드되지 않으며 모든 것이 브라우저에 남습니다",
    h2t:"출력 유형, 소재, 프린터", h2s:"밀도와 소비전력이 자동으로 채워집니다 — 필요하면 수정하세요.",
    modeFdm:"FDM (필라멘트)", modeResin:"레진",
    lblMaterial:"소재", lblPrinter:"프린터", lblWeight:"필라멘트 무게", lblDensity:"밀도",
    lblFilPrice:"필라멘트 가격", lblWatt:"프린터 전력", lblResinVol:"레진 용량", lblResinPrice:"레진 가격",
    lblResinWatt:"프린터 + UV 탱크 전력", lblConsumables:"소모품 (IPA, 장갑 등)",
    lblResinMaterial:"레진 종류", lblResinPrinter:"레진 프린터",
    lblBrand:"브랜드 (선택 사항)", brandPh:"예: eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"색상",
    lblTime:"출력 시간", unitH:"시간", unitM:"분", lblElec:"전기 단가",
    h3t:"운영 비용", h3s:"이 섹션은 브라우저에 저장되어 다시 입력할 필요가 없습니다.",
    lblFail:"불량/실패 출력 비율", lblPost:"후처리/인건비",
    lblLaborRate:"시간당 인건비", lblLaborTime:"소요된 작업 시간", unitMin:"분",
    depToggle:"프린터 감가상각 추가", depToggleSub:"장비 마모를 비용에 포함",
    lblPrinterCost:"프린터 비용", lblLifetime:"예상 수명", unitHours:"시간",
    lblMargin:"이익률", lblFx:"환율 (₺당)",
    ticketTitle:"비용 명세서", btnQuote:"고객 견적서 작성", savedMsg:"설정이 저장되었습니다",
    quoteHeadTitle:"견적 세부정보", lblBizName:"업체명", lblCustName:"고객명", lblPartName:"부품/프로젝트명",
    btnCopy:"📋 클립보드에 복사", footer:"모든 계산은 브라우저에서 실행되며 데이터는 전송되지 않습니다.",
    rowMaterial:"소재 비용", rowElec:"전기 비용", rowFail:"불량 비율", rowPost:"후처리/인건비",
    rowDep:"장비 감가상각", rowSubtotal:"소계 (비용)", rowMargin:"이익률", rowTotal:"고객 가격",
    noFile:"파일 데이터를 감지하지 못했습니다. 수동으로 입력하세요.", fileOkWeight:"그램", fileOkTime:"시간",
    parsedBoth:"파일에서 읽음:", parsedPartial:"부분적으로 읽음, 나머지는 수동으로 입력하세요:",
    parsedNone:"이 파일에서 인식 가능한 슬라이서 서명을 찾을 수 없습니다. 무게와 시간을 수동으로 입력할 수 있습니다.",
    fxMissing:"환율이 입력되지 않았습니다 — 금액이 ₺로 표시됩니다.",
    auto:"자동", quoteCopied:"견적서가 복사되었습니다 ✓", perHour:"/시간", qtyLabel:"수량",
    dateLocale:"ko-KR"
  },
  hi:{
    eyebrow:"स्वचालित मूल्य निर्धारण",
    heroTitle:"प्रिंट अपलोड करें, कीमत पाएं।",
    heroSub:"अपनी G-code फ़ाइल खींचें, सामग्री और प्रिंटर चुनें — वज़न, समय और पावर अपने आप भर जाएंगे। बाकी सेटिंग्स एक बार दर्ज करें, आपका ब्राउज़र याद रखेगा।",
    h1t:"फ़ाइल से स्वतः भरना", h1s:"Cura, PrusaSlicer, OrcaSlicer, Bambu Studio या Simplify3D से आउटपुट .gcode / .bgcode / .gco फ़ाइलें समर्थित हैं।",
    dropT1:"अपनी G-code फ़ाइल यहाँ छोड़ें", dropT2:"या चुनने के लिए क्लिक करें — कुछ भी अपलोड नहीं होता, सब कुछ ब्राउज़र में रहता है",
    h2t:"प्रिंट प्रकार, सामग्री, प्रिंटर", h2s:"घनत्व और बिजली खपत अपने आप भर जाती है — चाहें तो बदल सकते हैं।",
    modeFdm:"FDM (फिलामेंट)", modeResin:"रेज़िन",
    lblMaterial:"सामग्री", lblPrinter:"प्रिंटर", lblWeight:"फिलामेंट वज़न", lblDensity:"घनत्व",
    lblFilPrice:"फिलामेंट मूल्य", lblWatt:"प्रिंटर पावर", lblResinVol:"रेज़िन मात्रा", lblResinPrice:"रेज़िन मूल्य",
    lblResinWatt:"प्रिंटर + UV टैंक पावर", lblConsumables:"उपभोज्य सामग्री (IPA, दस्ताने आदि)",
    lblResinMaterial:"रेज़िन प्रकार", lblResinPrinter:"रेज़िन प्रिंटर",
    lblBrand:"ब्रांड (वैकल्पिक)", brandPh:"जैसे eSUN, Polymaker, Prusament, Bambu Lab",
    lblColor:"रंग",
    lblTime:"प्रिंट समय", unitH:"घं", unitM:"मि", lblElec:"बिजली दर",
    h3t:"संचालन लागत", h3s:"यह भाग ब्राउज़र में सहेजा जाता है — दोबारा दर्ज करने की आवश्यकता नहीं।",
    lblFail:"खराबी/असफल प्रिंट अनुपात", lblPost:"पोस्ट-प्रोसेसिंग/श्रम लागत",
    lblLaborRate:"प्रति घंटा मज़दूरी", lblLaborTime:"लगा हुआ श्रम समय", unitMin:"मि",
    depToggle:"प्रिंटर मूल्यह्रास जोड़ें", depToggleSub:"मशीन घिसावट को लागत में शामिल करें",
    lblPrinterCost:"प्रिंटर लागत", lblLifetime:"अपेक्षित आयु", unitHours:"घंटे",
    lblMargin:"लाभ मार्जिन", lblFx:"विनिमय दर (₺ प्रति)",
    ticketTitle:"लागत रसीद", btnQuote:"ग्राहक कोटेशन बनाएं", savedMsg:"सेटिंग्स सहेजी गईं",
    quoteHeadTitle:"कोटेशन विवरण", lblBizName:"व्यवसाय का नाम", lblCustName:"ग्राहक का नाम", lblPartName:"पार्ट/प्रोजेक्ट नाम",
    btnCopy:"📋 क्लिपबोर्ड पर कॉपी करें", footer:"सभी गणनाएँ ब्राउज़र में होती हैं, कोई डेटा नहीं भेजा जाता।",
    rowMaterial:"सामग्री लागत", rowElec:"बिजली लागत", rowFail:"खराबी अनुपात", rowPost:"पोस्ट-प्रोसेसिंग/श्रम",
    rowDep:"मशीन मूल्यह्रास", rowSubtotal:"उप-योग (लागत)", rowMargin:"लाभ मार्जिन", rowTotal:"ग्राहक मूल्य",
    noFile:"फ़ाइल डेटा नहीं मिला, मान मैन्युअल रूप से दर्ज करें।", fileOkWeight:"ग्राम", fileOkTime:"समय",
    parsedBoth:"फ़ाइल से पढ़ा गया:", parsedPartial:"आंशिक रूप से पढ़ा गया, बाकी मैन्युअल रूप से भरें:",
    parsedNone:"इस फ़ाइल में कोई पहचानने योग्य स्लाइसर हस्ताक्षर नहीं मिला। आप वज़न और समय मैन्युअल रूप से दर्ज कर सकते हैं।",
    fxMissing:"कोई विनिमय दर दर्ज नहीं — राशि ₺ में दिखाई जा रही है।",
    auto:"स्वचालित", quoteCopied:"कोटेशन कॉपी किया गया ✓", perHour:"/घं", qtyLabel:"मात्रा",
    dateLocale:"hi-IN"
  }
};
var LANGS = [
  {code:"tr", native:"Türkçe"},
  {code:"en", native:"English"},
  {code:"de", native:"Deutsch"},
  {code:"fr", native:"Français"},
  {code:"es", native:"Español"},
  {code:"pt", native:"Português"},
  {code:"it", native:"Italiano"},
  {code:"ru", native:"Русский"},
  {code:"ar", native:"العربية"},
  {code:"zh", native:"中文"},
  {code:"ja", native:"日本語"},
  {code:"ko", native:"한국어"},
  {code:"hi", native:"हिन्दी"}
];
var lang = "tr";
function t(k){ return (STR[lang] && STR[lang][k]) || k; }
function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(function(el){
    var k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });
  document.title = lang === "tr" ? "Hesaplayıcı — Umt3D Studio" : "Calculator — Umt3D Studio";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  renderColorSwatches();
  render();
}

/* ---------------- storage ---------------- */
var STORE_KEY = "umt3d_calc_profile_v1";
function loadProfile(){
  try{
    var raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function saveProfile(){
  try{
    var data = {
      lang: lang, currency: currency,
      elecPrice: $("elecPrice").value, filPrice: $("filPrice").value,
      failRate: $("failRate").value, postProcess: $("postProcess").value,
      laborRate: $("laborRate").value, margin: $("margin").value,
      depToggle: $("depToggle").checked, printerCost: $("printerCost").value,
      lifetimeHours: $("lifetimeHours").value, fxRates: fxRates,
      bizName: $("bizName") ? $("bizName").value : "", material: $("material").value,
      printer: $("printer").value, resinPrice: $("resinPrice").value,
      materialBrand: $("materialBrand") ? $("materialBrand").value : "",
      color: selectedColor,
      resinMaterial: $("resinMaterial") ? $("resinMaterial").value : "",
      resinPrinter: $("resinPrinter") ? $("resinPrinter").value : ""
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    var pill = $("savedPill");
    pill.classList.add("show");
    clearTimeout(window.__savedTimer);
    window.__savedTimer = setTimeout(function(){ pill.classList.remove("show"); }, 1600);
  }catch(e){ /* storage unavailable, ignore */ }
}

/* ---------------- data: materials & printers ---------------- */
var MATERIALS = [
  {id:"pla", tr:"PLA", en:"PLA", density:1.24, price:650},
  {id:"pla_silk", tr:"PLA Silk", en:"Silk PLA", density:1.23, price:750},
  {id:"pla_matte", tr:"PLA Mat", en:"Matte PLA", density:1.24, price:750},
  {id:"pla_wood", tr:"PLA Ahşap Dolgulu", en:"PLA Wood-fill", density:1.15, price:900},
  {id:"pla_glow", tr:"PLA Karanlıkta Parlayan", en:"PLA Glow-in-the-dark", density:1.26, price:1050},
  {id:"pla_marble", tr:"PLA Mermer Desenli", en:"PLA Marble", density:1.25, price:950},
  {id:"pla_metal", tr:"PLA Metal Dolgulu (Bronz/Bakır)", en:"PLA Metal-fill (Bronze/Copper)", density:1.75, price:1900},
  {id:"petg", tr:"PETG", en:"PETG", density:1.27, price:750},
  {id:"petg_cf", tr:"PETG Karbon Fiber", en:"PETG Carbon Fiber", density:1.30, price:1600},
  {id:"abs", tr:"ABS", en:"ABS", density:1.04, price:700},
  {id:"asa", tr:"ASA", en:"ASA", density:1.05, price:850},
  {id:"tpu85", tr:"TPU 85A (Çok Esnek)", en:"TPU 85A (Very Flexible)", density:1.20, price:1200},
  {id:"tpu95", tr:"TPU 95A (Esnek)", en:"TPU 95A (Flexible)", density:1.21, price:1100},
  {id:"nylon", tr:"Naylon (PA)", en:"Nylon (PA)", density:1.14, price:1600},
  {id:"nylon_cf", tr:"Naylon Karbon Fiber (PA-CF)", en:"Nylon Carbon Fiber (PA-CF)", density:1.19, price:2400},
  {id:"pahtcf", tr:"PAHT-CF", en:"PAHT-CF", density:1.19, price:2600},
  {id:"pc", tr:"Polikarbonat (PC)", en:"Polycarbonate (PC)", density:1.19, price:1700},
  {id:"pp", tr:"Polipropilen (PP)", en:"Polypropylene (PP)", density:0.90, price:1300},
  {id:"hips", tr:"HIPS", en:"HIPS", density:1.03, price:750},
  {id:"pva", tr:"PVA (Destek)", en:"PVA (Support)", density:1.23, price:2200},
  {id:"cf_pla", tr:"Karbon Fiber PLA", en:"Carbon Fiber PLA", density:1.30, price:1500},
  {id:"gf_pla", tr:"Cam Fiber PLA (GF)", en:"Glass Fiber PLA (GF)", density:1.33, price:1400},
  {id:"wood", tr:"Ahşap Dolgulu (PLA değil)", en:"Wood-fill (non-PLA base)", density:1.15, price:900},
  {id:"custom_fdm", tr:"Özel / Diğer", en:"Custom / Other", density:1.24, price:700}
];

var RESIN_MATERIALS = [
  {id:"standard", tr:"Standart Reçine", en:"Standard Resin", price:1400},
  {id:"tough_abs", tr:"Sert / ABS-benzeri Reçine", en:"Tough / ABS-like Resin", price:1900},
  {id:"flexible", tr:"Esnek Reçine", en:"Flexible Resin", price:2200},
  {id:"water_wash", tr:"Suda Yıkanabilir Reçine", en:"Water-washable Resin", price:1600},
  {id:"castable", tr:"Dökülebilir Reçine (Mücevher)", en:"Castable Resin (Jewelry)", price:3200},
  {id:"dental", tr:"Dental / Biyouyumlu Reçine", en:"Dental / Biocompatible Resin", price:4200},
  {id:"high_temp", tr:"Yüksek Sıcaklık Reçinesi", en:"High-Temp Resin", price:2800},
  {id:"custom_resin", tr:"Özel / Diğer", en:"Custom / Other", price:1800}
];

var COLORS = [
  {id:"black", tr:"Siyah", en:"Black", hex:"#1A1A1A"},
  {id:"white", tr:"Beyaz", en:"White", hex:"#F5F5F2"},
  {id:"gray", tr:"Gri", en:"Gray", hex:"#9A9A9A"},
  {id:"silver", tr:"Gümüş", en:"Silver", hex:"#C6C9CC"},
  {id:"red", tr:"Kırmızı", en:"Red", hex:"#E3362A"},
  {id:"orange", tr:"Turuncu", en:"Orange", hex:"#F2792B"},
  {id:"yellow", tr:"Sarı", en:"Yellow", hex:"#F3C230"},
  {id:"gold", tr:"Altın", en:"Gold", hex:"#C9A227"},
  {id:"green", tr:"Yeşil", en:"Green", hex:"#3DA35D"},
  {id:"blue", tr:"Mavi", en:"Blue", hex:"#2E6FEE"},
  {id:"skyblue", tr:"Gök Mavisi", en:"Sky Blue", hex:"#5CC3E8"},
  {id:"purple", tr:"Mor", en:"Purple", hex:"#8A4FD1"},
  {id:"pink", tr:"Pembe", en:"Pink", hex:"#F06BA8"},
  {id:"brown", tr:"Kahverengi", en:"Brown", hex:"#8A5A3B"},
  {id:"clear", tr:"Şeffaf", en:"Clear", hex:"#E8EEF2"},
  {id:"natural", tr:"Doğal (Renksiz)", en:"Natural", hex:"#EDE3CF"}
];

var PRINTERS = [
  {group:"Creality", items:[
    {id:"ender3", name:"Ender 3 / 3 Pro", w:120},
    {id:"ender3v2", name:"Ender 3 V2 / Neo", w:150},
    {id:"ender3s1", name:"Ender 3 S1 / S1 Pro", w:170},
    {id:"ender3v3", name:"Ender 3 V3 / V3 SE / KE", w:160},
    {id:"ender5", name:"Ender 5 / 5 Plus", w:160},
    {id:"ender5s1", name:"Ender 5 S1", w:180},
    {id:"cr6se", name:"CR-6 SE", w:150},
    {id:"cr10", name:"CR-10 / CR-10S", w:220},
    {id:"cr10smart", name:"CR-10 Smart / Smart Pro", w:230},
    {id:"k1", name:"K1", w:280},
    {id:"k1c", name:"K1C", w:280},
    {id:"k1max", name:"K1 Max", w:320},
    {id:"sermoon", name:"Sermoon V1 / D3", w:130}
  ]},
  {group:"Prusa Research", items:[
    {id:"mk3s", name:"i3 MK3S+", w:120},
    {id:"mk4", name:"MK4 / MK4S", w:150},
    {id:"mini", name:"MINI+", w:90},
    {id:"xl", name:"XL", w:260},
    {id:"coreone", name:"CORE One", w:180}
  ]},
  {group:"Bambu Lab", items:[
    {id:"x1", name:"X1", w:170},
    {id:"x1c", name:"X1 Carbon", w:180},
    {id:"x1e", name:"X1E", w:220},
    {id:"p1p", name:"P1P", w:170},
    {id:"p1s", name:"P1S", w:200},
    {id:"p2s", name:"P2S", w:210},
    {id:"a1", name:"A1", w:150},
    {id:"a1mini", name:"A1 Mini", w:90},
    {id:"h2d", name:"H2D", w:280}
  ]},
  {group:"Anycubic", items:[
    {id:"kobra2", name:"Kobra 2 / 2 Pro", w:160},
    {id:"kobra2max", name:"Kobra 2 Max", w:220},
    {id:"kobra3", name:"Kobra 3", w:180},
    {id:"vyper", name:"Vyper", w:150},
    {id:"megax", name:"Mega X / S", w:190}
  ]},
  {group:"Elegoo", items:[
    {id:"neptune3", name:"Neptune 3 / 3 Pro", w:150},
    {id:"neptune4", name:"Neptune 4 / 4 Pro", w:170},
    {id:"neptune4max", name:"Neptune 4 Max", w:220}
  ]},
  {group:"Qidi Tech", items:[
    {id:"xmax3", name:"X-Max 3", w:260},
    {id:"xplus3", name:"X-Plus 3", w:220},
    {id:"xsmart3", name:"X-Smart 3", w:140},
    {id:"q1pro", name:"Q1 Pro", w:200}
  ]},
  {group:"Flashforge", items:[
    {id:"adv3", name:"Adventurer 3 / 4", w:90},
    {id:"adv5m", name:"Adventurer 5M (Pro)", w:160},
    {id:"creatorpro", name:"Creator Pro 2", w:220},
    {id:"guider3", name:"Guider 3 Ultra", w:260}
  ]},
  {group:"Sovol", items:[
    {id:"sv06", name:"SV06 / SV06 Plus", w:150},
    {id:"sv06ace", name:"SV06 Ace", w:160},
    {id:"sv07", name:"SV07 / SV07 Plus", w:190}
  ]},
  {group:"Artillery", items:[
    {id:"sidewinderx2", name:"Sidewinder X2 / X3", w:190},
    {id:"genius", name:"Genius Pro", w:170}
  ]},
  {group:"Snapmaker", items:[
    {id:"j1", name:"J1 / J1s", w:200},
    {id:"artisan", name:"Artisan", w:230}
  ]},
  {group:"UltiMaker", items:[
    {id:"s5", name:"S5", w:220},
    {id:"method", name:"Method / Method X", w:260}
  ]},
  {group:"Voron (DIY)", items:[
    {id:"voron24", name:"Voron 2.4", w:280},
    {id:"vorontrident", name:"Voron Trident", w:260}
  ]},
  {group:"Diğer / Other", items:[
    {id:"custom", name:"Özel güç değeri / Custom wattage", w:150}
  ]}
];

var RESIN_PRINTERS = [
  {group:"Elegoo", items:[
    {id:"mars3", name:"Mars 3 / 3 Pro", w:55},
    {id:"mars4", name:"Mars 4 / 4 Ultra", w:60},
    {id:"mars5", name:"Mars 5 / 5 Ultra", w:65},
    {id:"saturn2", name:"Saturn 2 / 3", w:75},
    {id:"saturn4u", name:"Saturn 4 Ultra", w:90}
  ]},
  {group:"Anycubic", items:[
    {id:"photonm3", name:"Photon Mono M3 / M3 Plus", w:65},
    {id:"photonm3max", name:"Photon Mono M3 Max", w:90},
    {id:"photonx2", name:"Photon Mono X2", w:80},
    {id:"photon2", name:"Photon Mono 2", w:55}
  ]},
  {group:"Creality", items:[
    {id:"halotone", name:"Halot-One / One Plus", w:60},
    {id:"halotmage", name:"Halot-Mage / Mage Pro", w:85}
  ]},
  {group:"Phrozen", items:[
    {id:"sonicmini8k", name:"Sonic Mini 8K / 8K S", w:70},
    {id:"sonicmega8k", name:"Sonic Mega 8K", w:95}
  ]},
  {group:"Diğer / Other", items:[
    {id:"customresin", name:"Özel güç değeri / Custom wattage", w:70}
  ]}
];

/* ---------------- helpers ---------------- */
function $(id){ return document.getElementById(id); }
function num(id){ var v = parseFloat($(id).value); return isNaN(v) ? 0 : v; }
function fmt(n, dec){
  dec = dec === undefined ? 2 : dec;
  if(!isFinite(n)) n = 0;
  var locale = t("dateLocale") || "en-US";
  try{
    return n.toLocaleString(locale, {minimumFractionDigits:dec, maximumFractionDigits:dec});
  }catch(e){
    return n.toLocaleString("en-US", {minimumFractionDigits:dec, maximumFractionDigits:dec});
  }
}

/* ---------------- currencies (46 major world currencies) ---------------- */
var CURRENCIES = [
  {code:"TRY", symbol:"₺", name:"Turkish Lira"},
  {code:"USD", symbol:"$", name:"US Dollar"},
  {code:"EUR", symbol:"€", name:"Euro"},
  {code:"GBP", symbol:"£", name:"British Pound"},
  {code:"JPY", symbol:"¥", name:"Japanese Yen"},
  {code:"CNY", symbol:"¥", name:"Chinese Yuan"},
  {code:"CHF", symbol:"CHF", name:"Swiss Franc"},
  {code:"CAD", symbol:"$", name:"Canadian Dollar"},
  {code:"AUD", symbol:"$", name:"Australian Dollar"},
  {code:"NZD", symbol:"$", name:"New Zealand Dollar"},
  {code:"SEK", symbol:"kr", name:"Swedish Krona"},
  {code:"NOK", symbol:"kr", name:"Norwegian Krone"},
  {code:"DKK", symbol:"kr", name:"Danish Krone"},
  {code:"PLN", symbol:"zł", name:"Polish Zloty"},
  {code:"CZK", symbol:"Kč", name:"Czech Koruna"},
  {code:"HUF", symbol:"Ft", name:"Hungarian Forint"},
  {code:"RON", symbol:"lei", name:"Romanian Leu"},
  {code:"BGN", symbol:"лв", name:"Bulgarian Lev"},
  {code:"RUB", symbol:"₽", name:"Russian Ruble"},
  {code:"UAH", symbol:"₴", name:"Ukrainian Hryvnia"},
  {code:"INR", symbol:"₹", name:"Indian Rupee"},
  {code:"PKR", symbol:"₨", name:"Pakistani Rupee"},
  {code:"BDT", symbol:"৳", name:"Bangladeshi Taka"},
  {code:"IDR", symbol:"Rp", name:"Indonesian Rupiah"},
  {code:"MYR", symbol:"RM", name:"Malaysian Ringgit"},
  {code:"SGD", symbol:"$", name:"Singapore Dollar"},
  {code:"THB", symbol:"฿", name:"Thai Baht"},
  {code:"VND", symbol:"₫", name:"Vietnamese Dong"},
  {code:"PHP", symbol:"₱", name:"Philippine Peso"},
  {code:"KRW", symbol:"₩", name:"South Korean Won"},
  {code:"AED", symbol:"د.إ", name:"UAE Dirham"},
  {code:"SAR", symbol:"﷼", name:"Saudi Riyal"},
  {code:"QAR", symbol:"ر.ق", name:"Qatari Riyal"},
  {code:"KWD", symbol:"د.ك", name:"Kuwaiti Dinar"},
  {code:"ILS", symbol:"₪", name:"Israeli Shekel"},
  {code:"EGP", symbol:"£", name:"Egyptian Pound"},
  {code:"ZAR", symbol:"R", name:"South African Rand"},
  {code:"NGN", symbol:"₦", name:"Nigerian Naira"},
  {code:"KES", symbol:"KSh", name:"Kenyan Shilling"},
  {code:"BRL", symbol:"R$", name:"Brazilian Real"},
  {code:"MXN", symbol:"$", name:"Mexican Peso"},
  {code:"ARS", symbol:"$", name:"Argentine Peso"},
  {code:"CLP", symbol:"$", name:"Chilean Peso"},
  {code:"COP", symbol:"$", name:"Colombian Peso"},
  {code:"PEN", symbol:"S/", name:"Peruvian Sol"},
  {code:"HKD", symbol:"$", name:"Hong Kong Dollar"},
  {code:"TWD", symbol:"$", name:"New Taiwan Dollar"}
];
function symbolFor(code){
  var c = CURRENCIES.find(function(x){ return x.code === code; });
  return c ? c.symbol : code;
}

function populateSelects(){
  var matSel = $("material");
  matSel.innerHTML = "";
  MATERIALS.forEach(function(m){
    var o = document.createElement("option");
    o.value = m.id;
    o.textContent = (lang==="tr" ? m.tr : m.en) + "  ·  " + m.density + " g/cm³";
    matSel.appendChild(o);
  });

  var pSel = $("printer");
  pSel.innerHTML = "";
  PRINTERS.forEach(function(g){
    var og = document.createElement("optgroup");
    og.label = g.group;
    g.items.forEach(function(p){
      var o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name + "  ·  ~" + p.w + "W";
      o.dataset.w = p.w;
      og.appendChild(o);
    });
    pSel.appendChild(og);
  });

  var rmSel = $("resinMaterial");
  if(rmSel){
    rmSel.innerHTML = "";
    RESIN_MATERIALS.forEach(function(m){
      var o = document.createElement("option");
      o.value = m.id;
      o.textContent = (lang==="tr" ? m.tr : m.en);
      o.dataset.price = m.price;
      rmSel.appendChild(o);
    });
  }

  var rpSel = $("resinPrinter");
  if(rpSel){
    rpSel.innerHTML = "";
    RESIN_PRINTERS.forEach(function(g){
      var og = document.createElement("optgroup");
      og.label = g.group;
      g.items.forEach(function(p){
        var o = document.createElement("option");
        o.value = p.id;
        o.textContent = p.name + "  ·  ~" + p.w + "W";
        o.dataset.w = p.w;
        og.appendChild(o);
      });
      rpSel.appendChild(og);
    });
  }

  renderColorSwatches();
}

function populateLangSelect(){
  var sel = $("langSelect");
  if(!sel) return;
  sel.innerHTML = "";
  LANGS.forEach(function(l){
    var o = document.createElement("option");
    o.value = l.code;
    o.textContent = l.native;
    sel.appendChild(o);
  });
  sel.value = lang;
}

function populateCurrencySelect(){
  var sel = $("curSelect");
  if(!sel) return;
  sel.innerHTML = "";
  CURRENCIES.forEach(function(c){
    var o = document.createElement("option");
    o.value = c.code;
    o.textContent = c.code + "  ·  " + c.symbol + "  ·  " + c.name;
    sel.appendChild(o);
  });
  sel.value = currency;
}

/* ---------------- color swatches ---------------- */
var selectedColor = "black";
function renderColorSwatches(){
  var row = $("colorRow");
  if(!row) return;
  row.innerHTML = "";
  COLORS.forEach(function(c){
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch" + (c.id === selectedColor ? " active" : "");
    btn.style.background = c.hex;
    btn.title = (lang==="tr" ? c.tr : c.en);
    btn.setAttribute("aria-label", (lang==="tr" ? c.tr : c.en));
    btn.dataset.color = c.id;
    btn.addEventListener("click", function(){
      selectedColor = c.id;
      row.querySelectorAll(".swatch").forEach(function(s){ s.classList.remove("active"); });
      btn.classList.add("active");
      var label = $("colorLabel");
      if(label) label.textContent = lang==="tr" ? c.tr : c.en;
      render(); scheduleSave();
    });
    row.appendChild(btn);
  });
  var label = $("colorLabel");
  if(label){
    var cur = COLORS.find(function(c){ return c.id === selectedColor; });
    label.textContent = cur ? (lang==="tr" ? cur.tr : cur.en) : "";
  }
}

/* ---------------- G-code parsing ---------------- */
function parseDurationToMinutes(str){
  if(!str) return null;
  str = str.toLowerCase();
  if(/^\s*\d+\s*$/.test(str)){
    return Math.round(parseInt(str,10) / 60);
  }
  var norm = str
    .replace(/days?/g, "d").replace(/hours?/g, "h")
    .replace(/minutes?/g, "m").replace(/seconds?/g, "s");
  var d = /(\d+)\s*d/.exec(norm);
  var h = /(\d+)\s*h/.exec(norm);
  var m = /(\d+)\s*m(?!s)/.exec(norm);
  var s = /(\d+)\s*s/.exec(norm);
  if(!d && !h && !m && !s) return null;
  var total = 0;
  if(d) total += parseInt(d[1],10) * 24 * 60;
  if(h) total += parseInt(h[1],10) * 60;
  if(m) total += parseInt(m[1],10);
  if(s) total += parseInt(s[1],10) / 60;
  return Math.round(total);
}

function lengthToGrams(lengthMm, diameterMm, density){
  var r = diameterMm / 2;
  var areaMm2 = Math.PI * r * r;
  var volMm3 = areaMm2 * lengthMm;
  var volCm3 = volMm3 / 1000;
  return volCm3 * density;
}

function parseGcode(text, density){
  var result = {weightG:null, minutes:null, source:null};

  var wMatch = /filament used \[g\]\s*=\s*([\d.,\s]+)/i.exec(text);
  if(wMatch){
    var parts = wMatch[1].split(",").map(function(x){ return parseFloat(x.trim()); }).filter(function(x){ return !isNaN(x); });
    if(parts.length){
      result.weightG = parts.reduce(function(a,b){ return a+b; }, 0);
      result.source = "prusa-family";
    }
  }
  var tMatch = /estimated printing time \(normal mode\)\s*=\s*([^\n\r]+)/i.exec(text) ||
               /estimated printing time\s*=\s*([^\n\r]+)/i.exec(text);
  if(tMatch){
    var mins = parseDurationToMinutes(tMatch[1]);
    if(mins !== null){ result.minutes = mins; result.source = result.source || "prusa-family"; }
  }

  if(result.weightG === null){
    var curaW = /;Filament weight\s*=\s*([\d.]+)/i.exec(text);
    if(curaW){ result.weightG = parseFloat(curaW[1]); result.source = "cura"; }
    else {
      var curaLenAll = text.match(/;Filament used:\s*([\d.]+)m/ig);
      if(curaLenAll && curaLenAll.length){
        var totalLen = 0;
        curaLenAll.forEach(function(line){
          var mm = /([\d.]+)m/i.exec(line);
          if(mm) totalLen += parseFloat(mm[1]) * 1000;
        });
        if(totalLen > 0){
          result.weightG = lengthToGrams(totalLen, 1.75, density);
          result.source = "cura";
        }
      }
    }
  }
  if(result.minutes === null){
    var curaTime = /;TIME:\s*(\d+)/i.exec(text) || /;PRINT\.TIME:\s*(\d+)/i.exec(text);
    if(curaTime){ result.minutes = Math.round(parseInt(curaTime[1],10) / 60); result.source = result.source || "cura"; }
  }

  if(result.weightG === null){
    var s3dW = /;\s*filament weight\s*[:=]\s*([\d.]+)\s*g/i.exec(text);
    if(s3dW){ result.weightG = parseFloat(s3dW[1]); result.source = "simplify3d"; }
    else{
      var s3dLen = /;\s*filament length\s*[:=]\s*([\d.]+)\s*mm/i.exec(text);
      if(s3dLen){ result.weightG = lengthToGrams(parseFloat(s3dLen[1]), 1.75, density); result.source = "simplify3d"; }
    }
  }
  if(result.minutes === null){
    var s3dTime = /;\s*build time\s*[:=]\s*([^\n\r]+)/i.exec(text);
    if(s3dTime){
      var m2 = parseDurationToMinutes(s3dTime[1]);
      if(m2 !== null){ result.minutes = m2; result.source = result.source || "simplify3d"; }
    }
  }

  return result;
}

/* ---------------- state ---------------- */
var currency = "TRY";
var fxRates = {};
var mode = "fdm";
var lastParsed = {weightG:null, minutes:null};
var quoteCounter = 1;

/* ---------------- wiring: locale controls ---------------- */
if($("langSelect")){
  $("langSelect").addEventListener("change", function(){
    lang = $("langSelect").value;
    applyI18n(); populateSelects(); populateLangSelect(); saveProfile();
  });
}
if($("curSelect")){
  $("curSelect").addEventListener("change", function(){
    currency = $("curSelect").value;
    $("fxRate").value = fxRates[currency] || "";
    updateUnitsLabels(); render(); saveProfile();
  });
}

function updateUnitsLabels(){
  var sym = symbolFor(currency);
  $("filPriceUnit").textContent = sym + "/kg";
  $("resinPriceUnit").textContent = sym + "/L";
  $("consUnit").textContent = sym;
  $("postUnit").textContent = sym;
  $("laborUnit").textContent = sym + t("perHour");
  $("printerCostUnit").textContent = sym;
  $("elecUnit").textContent = sym + "/kWh";
  $("fxUnit").textContent = currency + "/₺";
  var fxWrap = $("fxRate").parentElement.parentElement;
  fxWrap.style.display = currency === "TRY" ? "none" : "block";
}

/* ---------------- mode tabs ---------------- */
document.querySelectorAll(".modetabs button").forEach(function(btn){
  btn.addEventListener("click", function(){
    document.querySelectorAll(".modetabs button").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
    mode = btn.getAttribute("data-mode");
    $("fdmFields").hidden = mode !== "fdm";
    $("resinFields").hidden = mode !== "resin";
    render();
  });
});

/* ---------------- material / printer selection ---------------- */
$("material").addEventListener("change", function(){
  var m = MATERIALS.find(function(x){ return x.id === $("material").value; });
  if(m){
    $("density").value = m.density;
    if(!$("filPrice").dataset.touched) $("filPrice").value = m.price;
  }
  render();
});
$("printer").addEventListener("change", function(){
  var opt = $("printer").selectedOptions[0];
  if(opt && opt.dataset.w) $("watt").value = opt.dataset.w;
  render();
});
if($("resinMaterial")){
  $("resinMaterial").addEventListener("change", function(){
    var m = RESIN_MATERIALS.find(function(x){ return x.id === $("resinMaterial").value; });
    if(m && !$("resinPrice").dataset.touched) $("resinPrice").value = m.price;
    render();
  });
}
if($("resinPrinter")){
  $("resinPrinter").addEventListener("change", function(){
    var opt = $("resinPrinter").selectedOptions[0];
    if(opt && opt.dataset.w) $("resinWatt").value = opt.dataset.w;
    render();
  });
}
["filPrice","watt","resinWatt","resinPrice","materialBrand"].forEach(function(id){
  var el = $(id);
  if(!el) return;
  el.addEventListener("input", function(){ el.dataset.touched = "1"; render(); scheduleSave(); });
});

/* ---------------- dropzone ---------------- */
var dz = $("dropzone");
var fileInput = $("fileInput");
dz.addEventListener("click", function(){ fileInput.click(); });
["dragover","dragenter"].forEach(function(evt){
  dz.addEventListener(evt, function(e){ e.preventDefault(); dz.classList.add("hover"); });
});
["dragleave","drop"].forEach(function(evt){
  dz.addEventListener(evt, function(e){ e.preventDefault(); dz.classList.remove("hover"); });
});
dz.addEventListener("drop", function(e){
  var f = e.dataTransfer.files && e.dataTransfer.files[0];
  if(f) handleFile(f);
});
fileInput.addEventListener("change", function(){
  if(fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file){
  var reader = new FileReader();
  reader.onload = function(){
    var text = String(reader.result || "");
    var density = num("density") || 1.24;
    var res = parseGcode(text, density);
    lastParsed = res;
    renderParseResult(res, file.name);
    if(res.weightG !== null){
      $("weight").value = Math.round(res.weightG * 10) / 10;
      $("weightAutoHint").innerHTML = '<span class="auto-pill">'+t("auto")+'</span>';
    }
    if(res.minutes !== null){
      $("hours").value = Math.floor(res.minutes / 60);
      $("minutes").value = res.minutes % 60;
      $("timeAutoHint").innerHTML = '<span class="auto-pill">'+t("auto")+'</span>';
    }
    render();
  };
  reader.onerror = function(){
    renderParseResult({weightG:null, minutes:null, source:null}, file.name, true);
  };
  reader.readAsText(file);
}

function renderParseResult(res, filename, errored){
  var box = $("parseResult");
  box.innerHTML = "";
  var div = document.createElement("div");
  if(errored || (res.weightG === null && res.minutes === null)){
    div.className = "parsebox bad";
    div.innerHTML = "⚠️ " + t("parsedNone");
  } else if(res.weightG !== null && res.minutes !== null){
    div.className = "parsebox ok";
    div.innerHTML = "✅ <b>"+filename+"</b> — " + t("parsedBoth") + " " +
      fmt(res.weightG,1) + " g, " + Math.floor(res.minutes/60) + "s " + (res.minutes%60) + "dk";
  } else {
    div.className = "parsebox bad";
    div.innerHTML = "⚠️ <b>"+filename+"</b> — " + t("parsedPartial") + " " +
      (res.weightG !== null ? fmt(res.weightG,1)+" g" : "—") + " / " +
      (res.minutes !== null ? Math.floor(res.minutes/60)+"s "+(res.minutes%60)+"dk" : "—");
  }
  box.appendChild(div);
}

/* ---------------- depreciation toggle ---------------- */
$("depToggle").addEventListener("change", function(){
  $("depFields").hidden = !$("depToggle").checked;
  render();
});

/* ---------------- live recalculation ---------------- */
var allInputs = ["weight","density","filPrice","watt","resinVol","resinPrice","resinWatt","resinConsumables",
  "hours","minutes","elecPrice","failRate","postProcess","laborRate","laborTime","printerCost","lifetimeHours","margin"];
allInputs.forEach(function(id){
  $(id).addEventListener("input", function(){ render(); scheduleSave(); });
});
$("fxRate").addEventListener("input", function(){
  fxRates[currency] = num("fxRate");
  render(); scheduleSave();
});
var saveTimer;
function scheduleSave(){ clearTimeout(saveTimer); saveTimer = setTimeout(saveProfile, 900); }

function fx(amountTRY){
  if(currency === "TRY") return {value: amountTRY, ok:true};
  var rate = fxRates[currency];
  if(!rate) return {value: amountTRY, ok:false};
  return {value: amountTRY * rate, ok:true};
}

function render(){
  var lines = $("lines");
  lines.innerHTML = "";
  var warnBox = $("warnBox");
  warnBox.innerHTML = "";

  var materialCostTRY = 0, elecCostTRY = 0, consumablesTRY = 0;
  var badgeHtml = "";

  if(mode === "fdm"){
    var weight = num("weight");
    var density = num("density") || 1.24;
    var pricePerKg = num("filPrice");
    materialCostTRY = (weight/1000) * pricePerKg;
    badgeHtml = '<span class="badge">'+fmt(weight,1)+' g</span><span class="badge">'+fmt(density,2)+' g/cm³</span>';
  } else {
    var vol = num("resinVol");
    var pricePerL = num("resinPrice");
    materialCostTRY = (vol/1000) * pricePerL;
    consumablesTRY = num("resinConsumables");
    badgeHtml = '<span class="badge">'+fmt(vol,0)+' ml</span>';
  }

  var totalMinutes = num("hours")*60 + num("minutes");
  var totalHours = totalMinutes / 60;
  var watt = mode === "fdm" ? num("watt") : num("resinWatt");
  var elecPriceKwh = num("elecPrice");
  var kwh = (watt/1000) * totalHours;
  elecCostTRY = kwh * elecPriceKwh;
  badgeHtml += '<span class="badge">'+Math.floor(totalMinutes/60)+'sa '+(totalMinutes%60)+'dk</span><span class="badge">'+fmt(watt,0)+'W</span>';
  var curColor = COLORS.find(function(c){ return c.id === selectedColor; });
  if(curColor){
    badgeHtml += '<span class="badge"><span class="badge-swatch" style="background:'+curColor.hex+'"></span>'+(lang==="tr"?curColor.tr:curColor.en)+'</span>';
  }
  var brandVal = $("materialBrand") ? $("materialBrand").value.trim() : "";
  if(brandVal){
    badgeHtml += '<span class="badge">'+brandVal+'</span>';
  }
  $("modeBadge").innerHTML = badgeHtml;

  var baseCostTRY = materialCostTRY + elecCostTRY + consumablesTRY;

  var failRate = num("failRate") / 100;
  var failCostTRY = baseCostTRY * failRate;

  var postTRY = num("postProcess");
  var laborTRY = (num("laborRate")) * (num("laborTime")/60);
  var postTotalTRY = postTRY + laborTRY;

  var depTRY = 0;
  if($("depToggle").checked){
    var printerCost = num("printerCost");
    var lifetime = num("lifetimeHours") || 1;
    depTRY = (printerCost / lifetime) * totalHours;
  }

  var subtotalTRY = baseCostTRY + failCostTRY + postTotalTRY + depTRY;
  var marginPct = num("margin") / 100;
  var marginTRY = subtotalTRY * marginPct;
  var totalTRY = subtotalTRY + marginTRY;

  function addLine(labelKey, amountTRY, opts){
    opts = opts || {};
    var row = document.createElement("div");
    row.className = "line" + (opts.sum ? " sum" : "") + (opts.sub ? " sub" : "");
    var conv = fx(amountTRY);
    var sym = symbolFor(currency);
    row.innerHTML = '<span class="l">'+t(labelKey)+'</span><span class="r mono">'+sym+' '+fmt(conv.value, opts.dec===0?0:2)+'</span>';
    if(opts.sum && window.__prevTotal !== null && window.__prevTotal !== undefined && Math.abs(window.__prevTotal - amountTRY) > 0.005){
      row.classList.add("flash");
    }
    if(opts.sum) window.__prevTotal = amountTRY;
    lines.appendChild(row);
    return conv.ok;
  }

  var fxOk = true;
  fxOk = addLine("rowMaterial", materialCostTRY) && fxOk;
  fxOk = addLine("rowElec", elecCostTRY) && fxOk;
  fxOk = addLine("rowFail", failCostTRY) && fxOk;
  if(postTotalTRY > 0) fxOk = addLine("rowPost", postTotalTRY) && fxOk;
  if(depTRY > 0) fxOk = addLine("rowDep", depTRY) && fxOk;
  fxOk = addLine("rowSubtotal", subtotalTRY, {sub:true}) && fxOk;
  fxOk = addLine("rowMargin", marginTRY, {sub:true}) && fxOk;
  fxOk = addLine("rowTotal", totalTRY, {sum:true}) && fxOk;

  if(!fxOk){
    var w = document.createElement("div");
    w.className = "warnline";
    w.textContent = "⚠ " + t("fxMissing");
    warnBox.appendChild(w);
  }

  $("ticketTag").textContent = (mode === "fdm" ? "FDM" : "RESIN") + " · " + new Date().toLocaleDateString(t("dateLocale"));

  window.__lastCalc = {
    materialCostTRY:materialCostTRY, elecCostTRY:elecCostTRY, failCostTRY:failCostTRY,
    postTotalTRY:postTotalTRY, depTRY:depTRY, subtotalTRY:subtotalTRY, marginTRY:marginTRY, totalTRY:totalTRY
  };
  updateQuoteIfOpen();
}

/* ---------------- quote section ---------------- */
$("quoteBtn").addEventListener("click", function(){
  var sec = $("quoteSection");
  sec.hidden = !sec.hidden;
  if(!sec.hidden){
    if(!$("bizName").value) $("bizName").value = "Umt3D Studio";
    updateQuoteIfOpen();
    sec.scrollIntoView({behavior:"smooth", block:"nearest"});
  }
});
["bizName","custName","partName"].forEach(function(id){
  $(id).addEventListener("input", updateQuoteIfOpen);
});

function updateQuoteIfOpen(){
  if($("quoteSection").hidden) return;
  var calc = window.__lastCalc;
  if(!calc) return;
  var sym = symbolFor(currency);
  $("qBiz").textContent = $("bizName").value || "Umt3D Studio";
  $("qCust").textContent = ($("custName").value || "—") ;
  $("qPart").textContent = $("partName").value || (lang==="tr" ? "İsimsiz proje" : "Untitled project");
  $("qDate").textContent = new Date().toLocaleDateString(t("dateLocale"));
  $("qNo").textContent = "#" + new Date().getFullYear() + "-" + String(quoteCounter).padStart(3,"0");

  var rows = $("qRows");
  rows.innerHTML = "";
  function row(label, amountTRY, isTotal){
    var conv = fx(amountTRY);
    var r = document.createElement("div");
    r.className = "quote-row" + (isTotal ? " tot" : "");
    r.innerHTML = "<span>"+label+"</span><span class=\"mono\">"+sym+" "+fmt(conv.value,2)+"</span>";
    rows.appendChild(r);
  }
  row(t("rowSubtotal"), calc.subtotalTRY);
  row(t("rowMargin"), calc.marginTRY);
  row(t("rowTotal"), calc.totalTRY, true);
}

$("copyBtn").addEventListener("click", function(){
  var calc = window.__lastCalc;
  if(!calc) return;
  var sym = symbolFor(currency);
  var biz = $("bizName").value || "Umt3D Studio";
  var cust = $("custName").value || "—";
  var part = $("partName").value || (lang==="tr" ? "İsimsiz proje" : "Untitled project");
  var dateStr = new Date().toLocaleDateString(t("dateLocale"));
  var no = "#" + new Date().getFullYear() + "-" + String(quoteCounter).padStart(3,"0");
  var lines = [
    biz,
    (lang==="tr"?"Müşteri: ":"Customer: ") + cust,
    (lang==="tr"?"Proje: ":"Project: ") + part,
    dateStr + "  " + no,
    "---------------------------",
    t("rowSubtotal") + ": " + sym + " " + fmt(fx(calc.subtotalTRY).value,2),
    t("rowMargin") + ": " + sym + " " + fmt(fx(calc.marginTRY).value,2),
    t("rowTotal") + ": " + sym + " " + fmt(fx(calc.totalTRY).value,2)
  ];
  var curColor = COLORS.find(function(c){ return c.id === selectedColor; });
  var brandVal = $("materialBrand") ? $("materialBrand").value.trim() : "";
  var specLine = (curColor ? (lang==="tr"?"Renk: ":"Color: ") + (lang==="tr"?curColor.tr:curColor.en) : "") +
    (brandVal ? "  ·  " + (lang==="tr"?"Marka: ":"Brand: ") + brandVal : "");
  if(specLine) lines.splice(4, 0, specLine);
  var text = lines.join("\n");
  function done(){
    var btn = $("copyBtn");
    var orig = btn.textContent;
    btn.textContent = "✓ " + t("quoteCopied");
    setTimeout(function(){ btn.textContent = orig; }, 1800);
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){ done(); quoteCounter++; }).catch(function(){
      fallbackCopy(text); done(); quoteCounter++;
    });
  } else {
    fallbackCopy(text); done(); quoteCounter++;
  }
});
function fallbackCopy(text){
  try{
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }catch(e){ /* ignore */ }
}

/* ---------------- init ---------------- */
function init(){
  populateSelects();
  populateLangSelect();
  populateCurrencySelect();
  $("material").value = "pla";
  $("material").dispatchEvent(new Event("change"));
  $("printer").value = "ender3v2";
  $("printer").dispatchEvent(new Event("change"));

  $("weight").value = 42;
  $("hours").value = 3;
  $("minutes").value = 15;
  $("elecPrice").value = "";
  $("resinVol").value = 65;
  $("resinPrice").value = 1800;

  var saved = loadProfile();
  if(saved){
    try{
      lang = saved.lang || "tr";
      currency = saved.currency || "TRY";
      if(saved.elecPrice) $("elecPrice").value = saved.elecPrice;
      if(saved.filPrice){ $("filPrice").value = saved.filPrice; $("filPrice").dataset.touched = "1"; }
      if(saved.failRate !== undefined) $("failRate").value = saved.failRate;
      if(saved.postProcess !== undefined) $("postProcess").value = saved.postProcess;
      if(saved.laborRate !== undefined) $("laborRate").value = saved.laborRate;
      if(saved.margin !== undefined) $("margin").value = saved.margin;
      if(saved.depToggle){ $("depToggle").checked = true; $("depFields").hidden = false; }
      if(saved.printerCost) $("printerCost").value = saved.printerCost;
      if(saved.lifetimeHours) $("lifetimeHours").value = saved.lifetimeHours;
      if(saved.fxRates && typeof saved.fxRates === "object"){ fxRates = saved.fxRates; }
      if(saved.bizName && $("bizName")) $("bizName").value = saved.bizName;
      if(saved.resinPrice) $("resinPrice").value = saved.resinPrice;
      if(saved.material){ $("material").value = saved.material; $("material").dispatchEvent(new Event("change")); }
      if(saved.printer){ $("printer").value = saved.printer; $("printer").dispatchEvent(new Event("change")); }
      if(saved.materialBrand && $("materialBrand")){ $("materialBrand").value = saved.materialBrand; $("materialBrand").dataset.touched = "1"; }
      if(saved.color){ selectedColor = saved.color; }
      if(saved.resinMaterial && $("resinMaterial")){ $("resinMaterial").value = saved.resinMaterial; }
      if(saved.resinPrinter && $("resinPrinter")){ $("resinPrinter").value = saved.resinPrinter; $("resinPrinter").dispatchEvent(new Event("change")); }

      populateLangSelect();
      populateCurrencySelect();
      $("fxRate").value = fxRates[currency] || "";
    }catch(e){ /* ignore corrupt profile */ }
  }

  updateUnitsLabels();
  applyI18n();
  render();
}
init();
})();
