import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type VulnId = 'cve-1' | 'cve-2' | 'cce-1'

interface HostRow {
  hostname: string
  ip: string
  os: string
  checked: boolean
}

interface VulnDetail {
  title: string
  badgeText: string
  badgeVariant: 'destructive' | 'default'
  desc: string
  date: string
  vector: string
  jobId: string
  count: string
  hosts: HostRow[]
}

const MOCK_DATABASE: Record<VulnId, VulnDetail> = {
  'cve-1': {
    title: 'CVE-2023-38408',
    badgeText: 'Critical (9.8)',
    badgeVariant: 'destructive',
    desc: 'OpenSSH의 ssh-agent에서 원격 코드 실행(RCE)이 가능한 취약점입니다. 공격자가 악성 PKCS#11 모듈을 로드하도록 유도하여 에이전트가 실행 중인 시스템에서 코드를 실행할 수 있습니다.',
    date: '2023-07-19',
    vector: 'CVSS:3.1/AV:N/AC:L...',
    jobId: 'job-2024-8891',
    count: '3',
    hosts: [
      { hostname: 'WEB-PRD-WAS01', ip: '10.20.30.45', os: 'Ubuntu 22.04', checked: false },
      { hostname: 'DB-PRD-MDB01', ip: '10.20.30.88', os: 'CentOS 7.9', checked: false },
      { hostname: 'DEV-TST-WAS02', ip: '172.16.5.12', os: 'Ubuntu 20.04', checked: true },
    ],
  },
  'cve-2': {
    title: 'CVE-2021-44228',
    badgeText: 'Critical (10.0)',
    badgeVariant: 'destructive',
    desc: 'Apache Log4j2 JNDI 기능에서 발생하는 심각한 원격 코드 실행(RCE) 취약점(Log4Shell)입니다. 공격자가 특수하게 조작된 문자열을 로그에 남기게 함으로써 시스템 권한을 탈취할 수 있습니다.',
    date: '2021-12-10',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    jobId: 'job-2024-0012',
    count: '5',
    hosts: [
      { hostname: 'API-GW-01', ip: '192.168.1.10', os: 'Amazon Linux 2', checked: false },
      { hostname: 'API-GW-02', ip: '192.168.1.11', os: 'Amazon Linux 2', checked: false },
      { hostname: 'BATCH-SERVER-01', ip: '10.50.1.99', os: 'Ubuntu 18.04', checked: false },
      { hostname: 'LEGACY-WAS-05', ip: '10.10.10.5', os: 'Windows Server 2012', checked: false },
      { hostname: 'DEV-LOG-SERVER', ip: '172.16.8.8', os: 'CentOS 8', checked: true },
    ],
  },
  'cce-1': {
    title: 'U-02 (패스워드 복잡성 설정)',
    badgeText: 'High',
    badgeVariant: 'default',
    desc: '시스템 계정의 패스워드가 영문, 숫자, 특수문자 조합으로 일정 길이 이상 설정되도록 강제하는 정책이 누락되어 있습니다. 무차별 대입 공격(Brute-force)에 취약해집니다.',
    date: 'N/A (인프라 설정)',
    vector: 'CCE-Ruleset-v3',
    jobId: 'job-2024-9099',
    count: '2',
    hosts: [
      { hostname: 'LEGACY-WAS-05', ip: '10.10.10.5', os: 'Windows Server 2012', checked: false },
      { hostname: 'QA-TEST-DB', ip: '192.168.50.50', os: 'CentOS 7.9', checked: false },
    ],
  },
}

const VULN_LIST: { id: VulnId; type: string; typeClass: string; title: string; desc: string; countLabel: string }[] = [
  { id: 'cve-1', type: 'CVE', typeClass: 'bg-purple-900 text-purple-300', title: 'CVE-2023-38408', desc: 'OpenSSH: Remote code execution', countLabel: '3' },
  { id: 'cve-2', type: 'CVE', typeClass: 'bg-purple-900 text-purple-300', title: 'CVE-2021-44228', desc: 'Apache Log4j2 JNDI (Log4Shell)', countLabel: '5' },
  { id: 'cce-1', type: 'CCE', typeClass: 'bg-teal-900 text-teal-300', title: 'U-02', desc: '패스워드 복잡성 설정 누락', countLabel: '2' },
]

const HOST_VIEW = {
  hostname: 'WEB-PRD-WAS01',
  status: 'Running',
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  ip: '10.20.30.45',
  os: 'Ubuntu 22.04.3 LTS',
  agent: 'v2.1.4',
  tags: ['AWS EC2', 'Service: E-Commerce'],
  securityScore: 78,
  cceScore: 92,
  cveScore: 64,
} as const

const HOST_VULN_LIST = [
  { type: 'CVE', typeClass: 'bg-purple-900 text-purple-300', id: 'CVE-2023-38408', description: 'OpenSSH: Remote code execution in ssh-agent', severity: 'Critical', severityClass: 'text-red-400 font-bold', result: 'Weak', resultClass: 'text-red-400 font-semibold', riskAccept: true },
  { type: 'CVE', typeClass: 'bg-purple-900 text-purple-300', id: 'CVE-2021-44228', description: 'Apache Log4j2 JNDI features do not protect against attacker controlled LDAP', severity: 'Critical', severityClass: 'text-red-400 font-bold', result: 'Weak', resultClass: 'text-red-400 font-semibold', riskAccept: true },
  { type: 'CCE', typeClass: 'bg-teal-900 text-teal-300', id: 'U-01', description: 'root 계정 원격 접속 제한 (PermitRootLogin no)', severity: 'High', severityClass: 'text-orange-400 font-bold', result: 'Safe', resultClass: 'text-green-400 font-semibold', riskAccept: null },
  { type: 'CCE', typeClass: 'bg-teal-900 text-teal-300', id: 'U-02', description: '패스워드 복잡성 설정 (Password complexity)', severity: 'High', severityClass: 'text-orange-400 font-bold', result: 'Weak', resultClass: 'text-red-400 font-semibold', riskAccept: true },
] as const

export function SecurityDashboard() {
  const [selectedVulnId, setSelectedVulnId] = useState<VulnId>('cve-1')
  const [hostChecks, setHostChecks] = useState<Record<string, Record<number, boolean>>>({})
  const [hostVulnRiskAccept, setHostVulnRiskAccept] = useState<Record<number, boolean>>({ 3: true })

  const detail = MOCK_DATABASE[selectedVulnId]
  const hosts = useMemo(() => {
    const base = detail.hosts
    const key = selectedVulnId
    return base.map((h, i) => ({
      ...h,
      checked: hostChecks[key]?.[i] ?? h.checked,
    }))
  }, [detail.hosts, selectedVulnId, hostChecks])

  const setHostChecked = (vulnId: VulnId, index: number, checked: boolean) => {
    setHostChecks((prev) => ({
      ...prev,
      [vulnId]: { ...prev[vulnId], [index]: checked },
    }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vuln-view" className="w-full">
        <TabsList className="bg-muted p-1 rounded-xl border w-fit">
          <TabsTrigger value="host-view" className="px-6 py-2.5 rounded-lg data-active:bg-background data-active:shadow-sm">
            1. 호스트 중심 뷰
          </TabsTrigger>
          <TabsTrigger value="vuln-view" className="px-6 py-2.5 rounded-lg data-active:bg-background data-active:shadow-sm">
            2. 취약점 중심 뷰
          </TabsTrigger>
        </TabsList>

        <TabsContent value="host-view" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6 border-b pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-bold">{HOST_VIEW.hostname}</h3>
                  <Badge className="bg-green-900/50 text-green-400 border-green-800 hover:bg-green-900/50">{HOST_VIEW.status}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">UUID: {HOST_VIEW.uuid} | IP: {HOST_VIEW.ip}</p>
                <p className="text-muted-foreground text-sm mt-1">OS: {HOST_VIEW.os} | Agent: {HOST_VIEW.agent}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-3 py-1 text-xs font-semibold bg-muted rounded-full">AWS EC2</span>
                  <span className="px-3 py-1 text-xs font-semibold bg-blue-900/50 text-blue-300 rounded-full">Service: E-Commerce</span>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div className="bg-muted/80 p-4 rounded-lg border w-32">
                  <p className="text-xs text-muted-foreground mb-1">Security Score</p>
                  <p className="text-3xl font-bold text-yellow-500">{HOST_VIEW.securityScore}</p>
                </div>
                <div className="bg-muted/80 p-4 rounded-lg border w-32">
                  <p className="text-xs text-muted-foreground mb-1">CCE Score</p>
                  <p className="text-3xl font-bold text-green-500">{HOST_VIEW.cceScore}</p>
                </div>
                <div className="bg-muted/80 p-4 rounded-lg border w-32">
                  <p className="text-xs text-muted-foreground mb-1">CVE Score</p>
                  <p className="text-3xl font-bold text-red-500">{HOST_VIEW.cveScore}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 border-l-4 border-primary pl-3">발견된 보안 취약점 목록</h4>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="p-3">Type</TableHead>
                      <TableHead className="p-3">ID</TableHead>
                      <TableHead className="p-3">Description</TableHead>
                      <TableHead className="p-3">Severity</TableHead>
                      <TableHead className="p-3">Result</TableHead>
                      <TableHead className="p-3 text-center">Risk Acceptance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {HOST_VULN_LIST.map((row, index) => (
                      <TableRow key={`${row.id}-${index}`}>
                        <TableCell className="p-3">
                          <span className={cn('px-2 py-1 rounded text-xs font-bold', row.typeClass)}>{row.type}</span>
                        </TableCell>
                        <TableCell className="p-3 font-mono text-primary">{row.id}</TableCell>
                        <TableCell className="p-3">{row.description}</TableCell>
                        <TableCell className={cn('p-3', row.severityClass)}>{row.severity}</TableCell>
                        <TableCell className={cn('p-3', row.resultClass)}>{row.result}</TableCell>
                        <TableCell className="p-3 text-center">
                          {row.riskAccept === null ? (
                            '-'
                          ) : (
                            <Switch
                              checked={hostVulnRiskAccept[index] ?? (index === 3)}
                              onCheckedChange={(checked) => setHostVulnRiskAccept((prev) => ({ ...prev, [index]: checked }))}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vuln-view" className="mt-6">
          <div className="flex gap-6 min-h-[700px]">
            <Card className="w-1/3 flex flex-col overflow-hidden">
              <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">전체 취약점 목록</CardTitle>
                <Badge variant="secondary" className="text-xs">총 {VULN_LIST.length}건 필터링 됨</Badge>
              </CardHeader>
              <CardContent className="overflow-y-auto flex-1 p-2 space-y-2">
                {VULN_LIST.map((item) => {
                  const isActive = selectedVulnId === item.id
                  const btnClass = cn(
                    'w-full p-4 rounded-lg border text-left flex justify-between items-center transition',
                    isActive ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:bg-muted/50'
                  )
                  const titleClass = cn('text-sm font-mono', isActive ? 'text-primary' : 'text-muted-foreground')
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedVulnId(item.id)}
                      className={btnClass}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', item.typeClass)}>{item.type}</span>
                          <span className={titleClass}>{item.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[12rem]">{item.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">영향 호스트</p>
                        <p className="font-bold text-destructive text-lg">{item.countLabel} 대</p>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="p-6 border-b space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{detail.title}</CardTitle>
                      <Badge variant={detail.badgeVariant} className="text-xs">{detail.badgeText}</Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed min-h-[40px]">{detail.desc}</CardDescription>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm bg-muted/50 p-4 rounded-lg border">
                  <div>
                    <span className="block text-muted-foreground text-xs mb-1">Published Date</span>
                    <span>{detail.date}</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-xs mb-1">Vector</span>
                    <span className="font-mono text-xs">{detail.vector}</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-xs mb-1">Job ID</span>
                    <span>{detail.jobId}</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-xs mb-1">Total Weak Count</span>
                    <span className="text-destructive font-bold text-lg">{detail.count}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-lg">영향 받는 호스트 목록</h4>
                  <Button size="sm">선택 호스트 Risk Accept 처리</Button>
                </div>
                <div className="flex-1 overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-12 text-center">선택</TableHead>
                        <TableHead>Hostname</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>OS</TableHead>
                        <TableHead className="text-center">Risk Acceptance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hosts.map((host, index) => (
                        <TableRow key={`${host.hostname}-${host.ip}`}>
                          <TableCell className="text-center">
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-mono text-primary hover:underline cursor-pointer">{host.hostname}</TableCell>
                          <TableCell className="text-muted-foreground">{host.ip}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{host.os}</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={host.checked}
                              onCheckedChange={(checked) => setHostChecked(selectedVulnId, index, checked)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
