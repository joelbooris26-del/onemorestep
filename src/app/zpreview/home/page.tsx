import { AppShell } from "@/components/layout/app-shell";
import { ProfileView } from "@/features/profile/components/profile-view";
import { CommunityIcon } from "@/features/communities/components/community-icon";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
export default function P() {
  return (
    <AppShell user={{ displayName: "Joel Merizalde", username: "joelm", avatarUrl: null }}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Joel 👋</h1>
        <Card><p className="font-semibold">Lanzar mi agencia de automatización</p><ProgressBar value={1} max={3} className="mt-3"/></Card>
        <div className="flex gap-3"><CommunityIcon icon="🚀" color="#f97316"/><CommunityIcon icon="🤖" color="#8b5cf6"/></div>
        <ProfileView isOwn profile={{displayName:"Joel Merizalde",username:"joelm",avatarUrl:null,bio:"Aprendiendo IA y automatización.",age:20,occupation:"Estudio",secondaryGoals:["Empezar un negocio","Aprender una habilidad"],mainGoal:"Lanzar mi agencia",stepsCompleted:4,joinedAt:new Date().toISOString(),visibility:"limited",communities:[{slug:"ia",name:"Inteligencia Artificial",icon:"🤖",color:"#8b5cf6"}]}} />
      </div>
    </AppShell>
  );
}
