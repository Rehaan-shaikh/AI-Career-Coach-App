"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  // console.log(entries);
  
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });
  
  // watch("field name") in React Hook Form means = "get the live value of a form field, as the user interacts with it.
  const current = watch("current");

  const handleAdd = handleValidation((data) => {  //this handleValidation will return a fun stored in handleAdd ,which is used in onClick  
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);  //to set value in form from parent component

    reset();
    setIsAdding(false);
  });

  const handleDelete = (indexToDelete) => {
    // console.log(entries , "from delete");
    
    const newEntries = entries.filter((_, i) => i !== indexToDelete);
    console.log(newEntries);
    
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);  ////manually setting value for description field when improvedContent arrived
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");    //getting value  of current description
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  const entriiies = entries;  //cause entries is the array of obj with having 1 or mult obj at a time
  console.log(entriiies);
  //For example:
  // 0: {title: 'aaaaaaaaaaa', organization: 'aaaaaaaa', startDate: 'Feb 2025', endDate: '', description: 'aaaaaaaaaaaaa', …}
  // 1: {title: 'sssssss', organization: 'ssssss', startDate: 'Mar 2025', endDate: 'Apr 2025', description: 'ssssssss', …}
  //means an exp / project entry can have mult  obj in it

  return (
    <div className="space-y-4">
      {entriiies && (
        <div className="space-y-4">
          {
            entriiies.map((entryItem, index) =>(
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {entryItem.title} @ {entryItem.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}   // ✅ delete specific entry by index
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {entryItem.current
                  ? `${entryItem.startDate} - Present`
                  : `${entryItem.startDate} - ${entryItem.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {entryItem.description}
              </p>
            </CardContent>
          </Card>              
            ))
          }

      </div>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title/Position"
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"  //this will render the calender functionality
                  {...register("endDate")}
                  disabled={current}   //if current is seected then disables it
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);  //manually setting value for checked field
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}  //watch("description doesnt return any value")
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  Improve with AI
                </>
              )}

            </Button>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>

            <Button type="button" onClick={handleAdd}>  
              {/* we are not using <Button onClick={handleValidation} /> cause handleValidation is fun from react-hook-form and returns a fun */}
              {/*or logic must be writtenn here only like: <Button onClick={handleValidation((data) => // logic ))} /> */}
              {/* type should be button , to prevent it from submitting */}
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}

// | Syntax                   | What it does                              | When to use                                  |
// | ------------------------ | ----------------------------------------- | -------------------------------------------- |
// | `onClick={myFn()}`       | ⚠️ Executes immediately on render         | ❌ Don’t use unless you return a function     |
// | `onClick={myFn}`         | ✅ Runs on click                           | ✅ Best when no args needed                   |
// | `onClick={() => myFn()}` | ✅ Runs on click with args or inline logic | ✅ Best for arguments or custom wrapper logic |

