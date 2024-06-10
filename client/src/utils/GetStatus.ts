import axios, { AxiosResponse } from "axios";
import { ProcesssResponse } from "../types";
import { toast } from "sonner";

export const getProcesss = async () => {
    try {
        const response: AxiosResponse<ProcesssResponse> = await axios.get(
            "http://localhost:4000/getstatus"
        );

        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        toast.error("error fetching process status")
        console.error(error);
    }
};