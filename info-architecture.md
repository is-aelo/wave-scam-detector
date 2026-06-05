flowchart TB
    subgraph Landing["Landing Page"]
        H["Hero + Animated Demo"]
        TM["Trust Metrics Bar"]
        F["Feature Cards"]
    end

    subgraph Scan["Scan Page"]
        Tabs{"Message or URL?"}
        MS["Message Scan Form"]
        US["URL Scan Form"]
    end

    subgraph Analysis["Analysis"]
        LT["Loading Terminal"]
    end

    subgraph Results["Result Panel"]
        RS["Risk Score Circle"]
        SB["Risk Spectrum Bar"]
        RF["Red Flags"]
        DG["Details Grid"]
        SC["Sources with Citations"]
        IG["Impact & Guidance"]
    end

    Landing --> Tabs
    Tabs --> MS
    Tabs --> US
    MS --> LT
    US --> LT
    LT --> Results