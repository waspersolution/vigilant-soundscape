
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatrolSession } from "@/types";
import RouteDataTab from "./RouteDataTab";
import PatrolHistoryTab from "./PatrolHistoryTab";

interface PatrolTabsProps {
  activePatrol: PatrolSession | null;
  pastPatrols: PatrolSession[];
  calculateDuration: (startTime: string, endTime?: string) => string;
}

export default function PatrolTabs({ activePatrol, pastPatrols, calculateDuration }: PatrolTabsProps) {
  return (
    <Tabs defaultValue="route">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="route">Current Route</TabsTrigger>
        <TabsTrigger value="history">Patrol History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="route" className="mt-4">
        <RouteDataTab activePatrol={activePatrol} />
      </TabsContent>
      
      <TabsContent value="history" className="mt-4">
        <PatrolHistoryTab 
          pastPatrols={pastPatrols} 
          calculateDuration={calculateDuration} 
        />
      </TabsContent>
    </Tabs>
  );
}
