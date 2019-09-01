exports.createHostsTable = `CREATE TABLE hosts (address_addr TEXT PRIMARY KEY,
                                                host_starttime INT,
                                                host_endtime INT,
                                                status_state TEXT,
                                                status_reason TEXT,
                                                status_reason_ttl INT,
                                                address_addrtype TEXT,
                                                hostname_name TEXT,
                                                hostname_type TEXT,
                                                times_srtt INT,
                                                times_rttvar INT,
                                                times_to INT,
                                                nmaprun_scanner TEXT,
                                                nmaprun_args TEXT,
                                                nmaprun_start INT,
                                                nmaprun_startstr TEXT,
                                                nmaprun_version TEXT,
                                                nmaprun_xmloutputversion INT,
                                                scaninfo_type TEXT,
                                                scaninfo_protocol TEXT,
                                                scaninfo_numservices INT,
                                                scaninfo_services TEXT,
                                                verbose_level INT,
                                                debugging_level INT,
                                                runstats_finished_time INT,
                                                runstats_finished_timestr TEXT,
                                                runstats_finished_elapsed INT,
                                                runstats_finished_summary TEXT,
                                                runstats_finished_exit TEXT,
                                                runstats_hosts_up INT,
                                                runstats_hosts_down INT,
                                                runstats_hosts_total INT);`;

exports.hostsQueryBuilder = (h_, nmaprun, scaninfo, runstats, name) => {
  const address_addr = h_.address[0].$.addr;
  const host_starttime = parseInt(h_.$.starttime);
  const host_endtime = parseInt(h_.$.starttime);
  const status_state = h_.status[0].$.state;
  const status_reason = h_.status[0].$.reason;
  const status_reason_ttl = parseInt(h_.status[0].$.reason_ttl);
  const address_addrtype = h_.address[0].$.addrtype;
  const hostname_name =
    h_.hostnames[0] === "" ? "n/a" : h_.hostnames[0].hostname[0].$.name;
  const hostname_type =
    h_.hostnames[0] === ""
      ? "n/a"
      : h_.hostnames[0].hostname[0].$.type.toString();
  const times_srtt = parseInt(h_.times[0].$.srtt);
  const times_rttvar = parseInt(h_.times[0].$.rttvar);
  const times_to = parseInt(h_.times[0].$.to);
  const nmaprun_scanner = nmaprun.$.scanner;
  const nmaprun_args = nmaprun.$.args;
  const nmaprun_start = parseInt(nmaprun.$.start);
  const nmaprun_startstr = nmaprun.$.startstr;
  const nmaprun_version = parseFloat(nmaprun.$.version);
  const nmaprun_xmloutputversion = parseFloat(nmaprun.$.xmloutputversion);
  const scaninfo_type = scaninfo.type;
  const scaninfo_protocol = scaninfo.protocol;
  const scaninfo_numservices = parseInt(scaninfo.numservices);
  const scaninfo_services = scaninfo.services;
  const verbose_level = parseInt(nmaprun.verbose[0].$.level);
  const debugging_level = parseInt(nmaprun.debugging[0].$.level);
  const runstats_finished_time = parseInt(runstats.time);
  const runstats_finished_timestr = runstats.timestr;
  const runstats_finished_elapsed = parseFloat(runstats.elapsed);
  const runstats_finished_summary = runstats.sumarry;
  const runstats_finished_exit = runstats.exit;
  const runstats_hosts_up = parseInt(nmaprun.runstats[0].hosts[0].$.up);
  const runstats_hosts_down = parseInt(nmaprun.runstats[0].hosts[0].$.down);
  const runstats_host_total = parseInt(nmaprun.runstats[0].hosts[0].$.total);

  const query = `INSERT INTO hosts VALUES ('${address_addr}',
                                          ${host_starttime},
                                          ${host_endtime},
                                          '${status_state}',
                                          '${status_reason}',
                                          ${status_reason_ttl},
                                          '${address_addrtype}',
                                          '${hostname_name}',
                                          '${hostname_type}',
                                          ${times_srtt},
                                          ${times_rttvar},
                                          ${times_to},
                                          '${nmaprun_scanner}',
                                          '${nmaprun_args}',
                                          ${nmaprun_start},
                                          '${nmaprun_startstr}',
                                          ${nmaprun_version},
                                          ${nmaprun_xmloutputversion},
                                          '${scaninfo_type}',
                                          '${scaninfo_protocol}',
                                          ${scaninfo_numservices},
                                          '${scaninfo_services}',
                                          ${verbose_level},
                                          ${debugging_level},
                                          ${runstats_finished_time},
                                          '${runstats_finished_timestr}',
                                          ${runstats_finished_elapsed},
                                          '${runstats_finished_summary}',
                                          '${runstats_finished_exit}',
                                          ${runstats_hosts_up},
                                          ${runstats_hosts_down},
                                          ${runstats_host_total}) ON CONFLICT(address_addr) DO NOTHING;`;
  return query;
};

exports.createPortsTable = `CREATE TABLE ports (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                portId INT,
                                                address_addr,
                                                state TEXT,
                                                state_reason TEXT,
                                                protocol TEXT,
                                                state_reason_ttl TEXT,
                                                service_name TEXT,
                                                service_method TEXT,
                                                service_conf INT);`;

exports.portsQueryBuilder = (p, h_) => {
  const portid = parseInt(p.$.portid);
  const address_addr = h_.address[0].$.addr;
  const state_state = p.state[0].state;
  const state_reason = p.state[0].state_reason;
  const state_reason_ttl = p.state[0].state_reason_ttl;
  const service_name = p.service[0].$.name;
  const service_method = p.service[0].$.method;
  const service_conf = parseInt(p.service[0].$.conf);
  const query = `INSERT INTO ports (portid,
                                    address_addr,
                                    state,
                                    state_reason,
                                    protocol,
                                    state_reason_ttl,
                                    service_name,
                                    service_method,
                                    service_conf)
                            VALUES ('${portid}',
                                    '${address_addr}',
                                    '${state_state}',
                                    '${state_reason}',
                                    '${state_reason}',
                                    '${state_reason_ttl}',
                                    '${service_name}',
                                    '${service_method}',
                                    ${service_conf});`;
  return query;
};

exports.createTasksTable = `CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                nmaprun_start INT,
                                                taskbegin_task TEXT,
                                                taskbegin_time INT,
                                                taskend_time INT,
                                                taskend_extrainfo TEXT)`;

exports.tasksQueryBuilder = (t, i, nmaprun) => {
  const taskbegin_task = t.$.task;
  const taskbegin_time = parseInt(t.$.time);
  const taskend_time = parseInt(nmaprun.taskend[i].$.time);
  const nmaprun_start = parseInt(nmaprun.$.start);
  const taskend_extrainfo = !nmaprun.taskend[i].$.extrainfo
    ? "n/a"
    : nmaprun.taskend[i].$.extrainfo;

  const query = `INSERT INTO tasks (nmaprun_start,
                                           taskbegin_task,
                                           taskbegin_time,
                                           taskend_time,
                                           taskend_extrainfo) 
                                   VALUES (${nmaprun_start},
                                           '${taskbegin_task}',
                                           ${taskbegin_time},
                                           ${taskend_time},
                                           '${taskend_extrainfo}')`;
  return query;
};

exports.getAllDocs = `SELECT * FROM ports 
                      LEFT OUTER JOIN hosts 
                      ON ports.address_addr=hosts.address_addr
                      LEFT OUTER JOIN tasks
                      ON hosts.nmaprun_start=tasks.nmaprun_start`;

exports.getAllDocsByIp = ip => `SELECT * FROM ports
                                LEFT OUTER JOIN hosts 
                                ON ports.address_addr=hosts.address_addr
                                LEFT OUTER JOIN tasks
                                ON hosts.nmaprun_start=tasks.nmaprun_start
                                WHERE hosts.address_addr='${ip}'`;
