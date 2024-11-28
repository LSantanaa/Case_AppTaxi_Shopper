import { useState } from "react";
import api from "../api";
import { ConfirmTravel, DataRequestTravel } from "../types";


export const useRideService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimateRide = async (data: DataRequestTravel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/estimate", data);
      if(response.status === 202){
        throw{
          message: response.data.error_description
        }
      }
      return response.data; 
    } catch (error: any) {
      setError(error.message||"Erro ao estimar a corrida");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmRide = async (data: ConfirmTravel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch("/confirm", data);
      return response.data.success;
    } catch (error: any) {
      setError(error.message || "Erro ao confirmar a corrida");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDrivers = async ()=>{
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/drivers/data')
      return res.data
    } catch (error:any) {
      setError(error.message||"Erro ao estimar a corrida");
      throw error;
    }finally{
      setLoading(false);
    }
  }
  
  const getHistory = async (customer_id: string, driver_id?:number)=>{
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/${customer_id}?driver_id=${driver_id}`)
      return res.data;
    } catch (error:any) {
      setError(error.message||"Erro ao estimar a corrida");
      throw error;
    }finally{
      setLoading(false);
    }
  }

  return {
    getHistory,
    getDrivers,
    estimateRide,
    confirmRide,
    loading,
    error,
  };
};
