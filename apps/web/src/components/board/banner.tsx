import { LightbulbIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Banner = () => {
  return (
    <div className="flex h-full items-center justify-center w-full">
      <Card className="bg-gradient-to-br border-2 border-dashed border-gray-300 dark:border-gray-800 dark:to-gray-900 from-blue-50 max-w-2xl px-10 shadow-lg to-indigo-50">
        <CardHeader className="pb-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <SparklesIcon className="dark:text-blue-400 size-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="dark:text-gray-100 font-bold text-2xl text-gray-900">
            Welcome to your Board Workspace!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="dark:text-gray-300 max-w-md mx-auto text-gray-600 text-lg">
            Ready to get organized? Create your first board to get start
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              className="bg-blue-600 duration-200 hover:scale-105 shadow-lg text-white transform transition-all"
              size="lg"
            >
              <PlusIcon className="mr-2 size-5" />
              Create your first board!
            </Button>
          </div>
          <div className="border-gray-200 border-t dark:border-gray-700 flex flex-row items-center justify-center pt-4">
            <LightbulbIcon className="mr-2 size-6 text-amber-400" />
            <p className="dark:text-gray-400 text-gray-500 text-sm">
              Tip: You can create boards for different projects, teams, or
              personal goals. You get 2 free boards to try!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
