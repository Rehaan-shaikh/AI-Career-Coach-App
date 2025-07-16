//  it is not mandatory to put custom hooks in a hooks name folder  or file name useXyz.js but is strongly recommended.
// but it is mandatory to start a custom hook with use
import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {  //it takes an updateuser or xyz server action as parameter 
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {   //this args is the data pass with fn as parameter
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fn , setData };
};

export default useFetch;
