interface ProcesssType {
  id: number;
  vendor_name: string;
  status: string;
  time: string;
  total_inserted: number;
  total_updated: number;
  total_skipped: number;
}

interface logMessage {
  message: string;
  data: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
}

interface ProcesssResponse {
  SuccessLogs: ProcesssType[];
  FailedLogs: ProcesssType[];
}

export { ProcesssType, logMessage, ProcesssResponse };
