import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
const cs = [["Emprendimiento","🚀","#f97316"],["Fitness","💪","#ef4444"],["Inteligencia Artificial","🤖","#8b5cf6"],["Programación","⌨️","#14b8a6"],["Nutrición","🥗","#22c55e"],["Productividad","⏱️","#eab308"]];
export default function P() {
  return <OnboardingFlow userId="preview" defaultName="Joel" communities={cs.map(([name,icon,color],i)=>({id:`00000000-0000-4000-8000-00000000000${i}`,slug:String(i),name,icon,color,description:""}))} />;
}
