javascript:ftb();

function getStatus() {

    // Prevent to log off
    $.ajax({
        type: "GET",
        url: "/tmpl/network/apn_setting.html?v=" + Math.round(+new Date() / 1000)
    })

    $.ajax({
        type: "GET",
        url: "/goform/goform_get_cmd_process",
        data: {
            cmd: "lte_pci,lte_pci_lock,lte_earfcn_lock,wan_ipaddr,wan_apn,pm_sensor_mdm,pm_modem_5g,nr5g_pci,nr5g_action_channel,nr5g_action_band,Z5g_SINR,Z5g_rsrp,wan_active_band,wan_active_channel,wan_lte_ca,lte_multi_ca_scell_info,cell_id,dns_mode,prefer_dns_manual,standby_dns_manual,network_type,rmcc,rmnc,lte_rsrq,lte_rssi,lte_rsrp,lte_snr,wan_lte_ca,lte_ca_pcell_band,lte_ca_pcell_bandwidth,lte_ca_scell_band,lte_ca_scell_bandwidth,lte_ca_pcell_arfcn,lte_ca_scell_arfcn,wan_ipaddr,static_wan_ipaddr,opms_wan_mode,opms_wan_auto_mode,ppp_status,loginfo",
            multi_data: "1"
        },
        dataType: "json",

        success: function (sig) {
            for (boxcar = gw / (gt + 1), signal = sig, vars = ["lte_pci", "lte_pci_lock", "lte_earfcn_lock", "wan_ipaddr", "wan_apn", "pm_sensor_mdm", "pm_modem_5g", "nr5g_pci", "nr5g_action_band", "nr5g_action_channel", "Z5g_SINR", "Z5g_rsrp", "wan_active_channel", "wan_active_band", "lte_multi_ca_scell_info", "cell_id", "dns_mode", "prefer_dns_manual", "standby_dns_manual", "rmcc", "rmnc", "network_type", "wan_lte_ca", "lte_rssi", "lte_rsrp", "lte_snr", "lte_rsrq", "lte_ca_pcell_bandwidth", "lte_ca_pcell_band"], i = 0; i < vars.length; i++) window[vars[i]] = sig[vars[i]];
            if ($("#nr5rsrpb").parent().toggle("" != sig.nr5g_action_band), $("#Z5g_SINR").parent().toggle("" != sig.nr5g_action_band), barGraph("rsrp", lte_rsrp, -130, -60), barGraph("rsrq", lte_rsrq, -16, -3), barGraph("sinr", lte_snr, 0, 24), barGraph("nr5rsrp", Z5g_rsrp, -130, -60), barGraph("nr5sinr", Z5g_SINR, 0, 24), cell_id = parseInt(cell_id, 16), enbid = Math.trunc(cell_id / 256), $("#earfcn_lock").html(lte_pci_lock + "/" + lte_earfcn_lock), plmn = rmcc.toString() + rmnc.toString(), $("#enbid").html(enbid), "22201" == plmn && (plmn = "2221"), "22299" == plmn && (plmn = "22288"), "22250" == plmn && 6 == enbid.length && (plmn = "22288"), link_lte = "https://lteitaly.it/internal/map.php#bts=" + plmn + "." + enbid, $("#lteitaly").attr("href", link_lte), "ca_activated" == wan_lte_ca ? $("#ca").parent().parent().css("border-color", "red") : $("#ca").parent().parent().css("border-color", "#bbb"), "" != lte_multi_ca_scell_info) {
                ca_v = lte_multi_ca_scell_info.slice(0, -1).split(";"), ca_txt = "";
                for (var i = 0; i < ca_v.length; i++) d = ca_v[i].split(","), b = d[3], w = d[5], ca_txt += '<span style="color:#b00;">B' + b + "</span>(@" + w + "Mhz)+";
                lte_ca_pcell_band = "B" + lte_ca_pcell_band
            } else ca_txt = "", lte_ca_pcell_band = wan_active_band;
            for (sig.nr5g_action_band && (ca_txt += '<span style="padding:5px;border-radius:3px;font-size:1.2em;background-color:#eef;color:red;font-weight:bold;">' + sig.nr5g_action_band + "</span>"), ca_txt = ca_txt.slice(0, -1), lte_multi_ca_scell_info = ca_txt, "manual" == dns_mode && (dns_mode = prefer_dns_manual + " ," + standby_dns_manual), dns_mode = dns_mode.replace(/,+$/, ""), dns_mode = '<span style="color:#b00;">' + dns_mode + "</span>", lte_ca_pcell_bandwidth && (lte_ca_pcell_bandwidth = "(@" + lte_ca_pcell_bandwidth + "Mhz)"), i = 0; i < vars.length; i++) $("#" + vars[i]).html(window[vars[i]])
        }
    })
}

function err(r, s, e) {
    alert("Communication Error"), console.log(r), console.log(s), console.log(e)
}

function barGraph(p, val, min, max) {
    for (val > max && (val = max), val < min && (val = min), ap = "a" + p, window[ap].unshift(val), window[ap].length > boxcar && window[ap].pop(), html = '<svg version="1.1" viewBox="0 0 ' + gw + " " + gh + '" width="' + gw + '" height="' + gh + '" preserveAspectRatio="xMaxYMax slice" style="border:1px solid #ccc;padding:1px;margin-top:-6px;width: ' + gw + 'px;">', x = 0; x < window[ap].length; x++) pax = (gt + 1) * (x + 1), pay = gh - 1, pby = gh - (window[ap][x] - min) / (max - min) * gh, pc = (window[ap][x] - min) / (max - min) * 100, pc < 50 ? color = "yellow" : pc < 85 ? color = "green" : color = "orange", html += '<line x1="' + pax + '" y1="' + pay + '" x2="' + pax + '" y2="' + pby + '" stroke="' + color + '" stroke-width="' + gt + '"></line>';
    html += "</svg>", $("#b" + p).html(html)
}

function lockcell(p, e) {
    $.ajax({
        type: "GET",
        url: "/goform/goform_get_cmd_process",
        data: {cmd: "wa_inner_version,cr_version,RD", multi_data: "1"},
        dataType: "json",
        success: function (data) {
            ad = cookWithRequest(cookWithRequest(data.wa_inner_version + data.cr_version) + data.RD), $.ajax({
                type: "POST",
                url: "/goform/goform_set_cmd_process",
                data: {isTest: "false", goformId: "LTE_LOCK_CELL_SET", lte_pci_lock: p, lte_earfcn_lock: e, AD: ad},
                success: function (a) {
                    console.log(a), j = JSON.parse(a), "success" == j.result ? alert("Now you have to Reboot!") : alert("Error. Modem didn't like it!")
                },
                error: err
            })
        }
    })
}

function cslock() {
    c = parseInt(lte_pci, 16) + "," + wan_active_channel;
    var pair = prompt("Please input PCI,EARFCN, separated by ',' char (example 116,3350). Leave default for lock on current main band.", c);
    if (null != pair && "" !== pair) {
        var p = pair.split(","), a;
        "YES" == prompt("If you cell lock, you have to RESET your router to take the lock away! If you are sure, type YES  (!UPPERCASE)") && lockcell(p[0], p[1])
    }
}

function ltebandselection() {
    var band = prompt("Please input LTE bands number, separated by + char (example 1+3+20).If you want to use every supported band, write 'AUTO'.", "AUTO");
    if (band && (band = band.toLowerCase()), null != band && "" !== band) {
        var bs = band.split("+"), ltesum = 0;
        if (all_bands = "0xA3E2AB0908DF", "AUTO" === band.toUpperCase()) ltesum = all_bands; else {
            for (var i = 0; i < bs.length; i++) ltesum += Math.pow(2, parseInt(bs[i]) - 1);
            ltesum = "0x" + ltesum.toString(16)
        }
        $.ajax({
            type: "GET",
            url: "/goform/goform_get_cmd_process",
            data: {cmd: "wa_inner_version,cr_version,RD", multi_data: "1"},
            dataType: "json",
            success: function (data) {
                ad = cookWithRequest(cookWithRequest(data.wa_inner_version + data.cr_version) + data.RD), $.ajax({
                    type: "POST",
                    url: "/goform/goform_set_cmd_process",
                    data: {
                        isTest: "false",
                        goformId: "BAND_SELECT",
                        is_gw_band: 0,
                        gw_band_mask: 0,
                        is_lte_band: 1,
                        lte_band_mask: ltesum,
                        AD: ad
                    },
                    success: function (res) {
                        console.log(res)
                    },
                    error: err
                })
            }
        })
    }
}

function nrbandselection() {
    var band = prompt("Please input 5G bands number, separated by + char (example 3+78).If you want to use every supported band, write 'AUTO'.", "AUTO");
    if (band && (band = band.toLowerCase()), null != band && "" !== band) {
        var bs = band.split("+").join(",");
        "AUTO" === band.toUpperCase() && (bs = "1,2,3,5,7,8,20,28,38,41,50,51,66,70,71,74,75,76,77,78,79,80,81,82,83,84"), $.ajax({
            type: "GET",
            url: "/goform/goform_get_cmd_process",
            data: {cmd: "wa_inner_version,cr_version,RD", multi_data: "1"},
            dataType: "json",
            success: function (data) {
                ad = cookWithRequest(cookWithRequest(data.wa_inner_version + data.cr_version) + data.RD), $.ajax({
                    type: "POST",
                    url: "/goform/goform_set_cmd_process",
                    data: {isTest: "false", goformId: "WAN_PERFORM_NR5G_BAND_LOCK", nr5g_band_mask: bs, AD: ad},
                    success: function (res) {
                        console.log(res)
                    },
                    error: err
                })
            }
        })
    }
}

function reboot() {
    $.ajax({
        type: "GET",
        url: "/goform/goform_get_cmd_process",
        data: {cmd: "wa_inner_version,cr_version,RD", multi_data: "1"},
        dataType: "json",
        success: function (data) {
            ad = cookWithRequest(cookWithRequest(data.wa_inner_version + data.cr_version) + data.RD), $.ajax({
                type: "POST",
                url: "/goform/goform_set_cmd_process",
                data: {isTest: "false", goformId: "REBOOT_DEVICE", AD: ad},
                success: function (res) {
                    console.log(res)
                },
                error: err
            })
        }
    })
}

function i1() {
    $.ajax({
        type: "GET",
        url: "/goform/goform_get_cmd_process",
        data: {cmd: "hardware_version,web_version,wa_inner_version,cr_version,RD", multi_data: "1"},
        dataType: "json",
        success: function (data) {
            v = "HW version:" + data.hardware_version + "\nWEB version:" + data.web_version + "\nWA INNER version:" + data.wa_inner_version, alert(v)
        }
    })
}

function i2() {
    if (ca_txt = wan_active_band + " - PCI,EARFCN:" + parseInt(lte_pci, 16) + "," + wan_active_channel, "" != signal.lte_multi_ca_scell_info) {
        ca_v = signal.lte_multi_ca_scell_info.slice(0, -1).split(";");
        for (let i = 0; i < ca_v.length; i++) d = ca_v[i].split(","), b = d[3], e = d[4], p = d[1], ca_txt += "\nB" + b + " - PCI,EARFCN:" + p + "," + e
    }
    ca_txt += "\n\n" + nr5g_action_band + " - PCI:" + parseInt(nr5g_pci, 16) + " - EARFCN:" + nr5g_action_channel, alert(ca_txt)
}

function setDns(dns) {
    if (!dns) return;

    dns = dns.toLowerCase();
    if (dns === "auto") {
          dns = prompt("Please input 2 dns servers, separated by \",\"  (example 1.1.1.1,1.0.0.1). If you want to use PROVIDER settings, write 'AUTO'.", "AUTO");
    }

    if (dns && "" !== dns) {
        var dnsSplitted = dns.split(",");
        dns_mode = "auto" === dns ? "auto" : "manual", $.ajax({
            type: "GET",
            url: "/goform/goform_get_cmd_process",
            data: {cmd: "wa_inner_version,cr_version,RD", multi_data: "1"},
            dataType: "json",
            success: function (data) {
                ad = cookWithRequest(cookWithRequest(data.wa_inner_version + data.cr_version) + data.RD), $.ajax({
                    type: "POST",
                    url: "/goform/goform_set_cmd_process",
                    data: {
                        isTest: "false",
                        goformId: "APN_PROC_EX",
                        wan_apn: signal.wan_apn,
                        profile_name: "HideMyAss",
                        apn_action: "save",
                        apn_mode: "manual",
                        pdp_type: "IP",
                        dns_mode: "manual",
                        prefer_dns_manual: dnsSplitted[0],
                        standby_dns_manual: dnsSplitted[1],
                        index: 1,
                        AD: ad
                    },
                    success: function (d) {
                        $.ajax({
                            type: "GET",
                            url: "/goform/goform_get_cmd_process",
                            data: {cmd: "wa_inner_version,cr_version,RD", multi_data: "1"},
                            dataType: "json",
                            success: function (data) {
                                ad = cookWithRequest(cookWithRequest(data.wa_inner_version + data.cr_version) + data.RD), $.ajax({
                                    type: "POST",
                                    url: "/goform/goform_set_cmd_process",
                                    data: {
                                        isTest: "false",
                                        goformId: "APN_PROC_EX",
                                        apn_mode: "manual",
                                        apn_action: "set_default",
                                        set_default_flag: 1,
                                        pdp_type: "IP",
                                        pdp_type_roaming: "IP",
                                        index: 1,
                                        AD: ad
                                    },
                                    error: err
                                })
                            },
                            error: err
                        })
                    },
                    error: err
                })
            }
        })
    }
}

function ftb() {
    $(".color_background_blue").css("background-color", "#456"),
        $(".headcontainer").hide(),
        $("body").prepend('' +
            '<style> ' +
            '.clear {clear: both; } ' +
            '.action {background-color: #448; padding: 10px; border-radius: 10px; color: white; font-weight: bolder; margin-right: 5px; margin-left: 5px; align-content: center; } ' +
            '.action:hover {color: white; } li span {margin-left: 5px; } #lte_ca_pcell_bandwidth {margin-left: 0; } #lte_rsrq, #lte_rsrp, #lte_rssi, #enbid, #lte_snr, #Z5g_SINR, #cell_id, #lte_ca_pcell_band, #pm_sensor_mdm, #pm_modem_5g, #earfcn_lock, #wan_ipaddr {color: #b00; font-weight: strong; } ' +
            '.f {float: left; border: 1px solid #bbb; border-radius: 5px; padding: 10px; line-height: 2em; margin: 5px; } ' +
            '.f ul {margin: 0; padding: 0; } ' +
            '.f ul li {display: inline; margin-right: 5px; margin-left: 5px; } #network_type {margin-right: 0 !important; } #enbid {font-weight: bold; text-decoration: underline; } ' +
            '.p {border-bottom: 1px solid #ccc; width: auto; height: 20px; } ' +
            '.v {height: 100%25; border-right: 1px solid #ccc; } ' +
            '.sb {padding: 10px; border-radius: 10px; display: inline-block; margin: 10px 0 10px 10px; } ' +
            '.v {padding-left: 20px; } ' +
            '</style> ' +
            '<div class="container" style="overflow:auto;"> ' +
            '<div class="f"> ' +
            'RSRP:<span id="lte_rsrp"></span>dBm<div id="brsrp"></div> ' +
            'RSRQ:<span id="lte_rsrq"></span>dB<div id="brsrq"></div> ' +
            'SINR:<span id="lte_snr"></span>dB<div id="bsinr"></div> ' +
            '</div> ' +
            '<div class="f nr"> NR RSRP:<span id="Z5g_rsrp"></span>dBm<div id="bnr5rsrp"></div>NR SINR:<span id="Z5g_SINR"></span>dB<div id="bnr5sinr"></div> </div> </div> ' +
            '<div class="container""> ' +
            '<div class="f"> ' +
            '<div class="f"> <ul> <li id="network_type"></li> </ul> </div> ' +
            '<div class="f"> <ul> <li>ENB ID:<a id="lteitaly" target="lteitaly" href="#"><span id="enbid">#</span></a></li> <li>CELL ID:<span id="cell_id">#</span></li> </ul> </div> ' +
            '<div class="f"> <ul> <li>MAIN:<span id="lte_ca_pcell_band"></span><span id="lte_ca_pcell_bandwidth"></span></li> <li id="ca">CA:<span id="lte_multi_ca_scell_info"></span></li> </ul> </div> ' +
            '<div class="f"> <ul> <li> <a class="action" onclick="reboot()">Restart Router</a> </li> </ul> </div> ' +
            '<div class="f clear"> <ul> <li><a href="#network_info">Network Info</a></li> <li><a href="#debug_page">Debug</a></li> <li><a href="#voip_setting">V1</a></li> <li><a href="#voip_settings">V2</a></li> <li><a href="#supplement_service">V3</a></li> <li><a href="#voip_advanced_settings">V4</a></li> <li><a href="#ant_switch">A1</a></li> <li><a href="#rf_mmw">A2</a></li> <li><a href="#temp_status">T1</a></li> <li><a href="#thermal_switch">T2</a></li> <li><a href="#bsp_tc_settings">T3</a></li> <li><a href="#wifi_main_chip1">W1</a></li> <li><a href="#wifi_main_chip2">W2</a></li> <li><a href="#wifi_mac_filter">W3</a></li> </ul> </div> ' +
            '<div class="f"> <ul> <li>WAN IP:<span id="wan_ipaddr"></span></li> </ul> </div> ' +
            '<div class="f"> <ul> <li> <a class="action" onclick="i1()">Firmware</a> </li> </ul> </div>' +
            '<div class="f"> <ul> <li>Temp</li> <li>4G:<span id="pm_sensor_mdm"></span>Â°</li> <li>5G:<span id="pm_modem_5g"></span>Â°</li> </ul> </div> ' +
            '<div class="f  "> <ul> ' +
            '<li><a class="action" onclick="ltebandselection()">Set 4G Band</a></li> ' +
            '<li><a class="action" onclick="nrbandselection()">Set 5G Band</a></li> </ul> ' +
            '</div> ' +
            '<div class="f"> <ul> ' +
            '<li> <a class="action" onclick="i2()">Info</a> </li> ' +
            '<li> <a class="action" onclick="cslock()">Cell Lock</a> <span id="earfcn_lock"></span> </li> ' +
            '</ul></div>'+
            '<div class="f"> <ul> ' +
            '<li><a class="action" onclick="setDns(\'AUTO\')">Set DNS</a><span id="dns_mode"> ' +
            '<li><span><a class="action" onclick="setDns(\'1.1.1.1,1.0.0.1\')">Cloudflare</a> </span></li>' +
            '<li><span><a class="action" onclick="setDns(\'8.8.8.8,8.8.4.4\')">Google</a> </span></li>' +
            '<li><span><a class="action" onclick="setDns(\'9.9.9.9,149.112.112.112\')">Quad 9</a> </span></li>' +
            '</span></li> </ul> </div> ' +
            '</div>' +
            '</div> </div>')
}

gw = 900, gh = 30, gt = 3, signal = "", version = "888/889-4.1", [arsrp, arsrq, asinr, anr5rsrp, anr5sinr] = [[], [], [], [], [], []], $("#txtUserName").attr("maxlength", "100"), console.log("Originally Coded by Miononno, Enhanced by Ju8z - v" + version), console.log("type: signal"), window.setInterval(getStatus, 1500), $("#change").prop("disabled", !1);