"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { employees } from "@/lib/mock-data";
import { Employee } from "@/lib/types";
import { getInitials, getAvatarColor } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [pin, setPin] = useState("");

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setPin("");
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleStartShift = () => {
    if (!selectedEmployee || pin.length !== 6) return;

    if (pin === selectedEmployee.pin) {
      // Store employee info in localStorage
      localStorage.setItem("currentEmployee", JSON.stringify(selectedEmployee));
      // Use window.location for full page reload to ensure proper routing
      window.location.href = "/";
    } else {
      alert("Incorrect PIN");
      setPin("");
    }
  };

  const handleBack = () => {
    setSelectedEmployee(null);
    setPin("");
  };

  if (!selectedEmployee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Restro POS</h1>
            <p className="text-gray-600">Select your profile to start shift</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {employees.map((employee) => (
              <button
                key={employee.id}
                onClick={() => handleEmployeeSelect(employee)}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105 text-center border border-gray-100 hover:border-primary/30"
              >
                <div
                  className={`w-20 h-20 rounded-full ${getAvatarColor(
                    employee.name
                  )} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                >
                  <span className="text-white text-2xl font-bold">
                    {getInitials(employee.name)}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-1">{employee.name}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {employee.role}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Employee Info */}
          <div className="text-center mb-8">
            <div
              className={`w-24 h-24 rounded-full ${getAvatarColor(
                selectedEmployee.name
              )} flex items-center justify-center mx-auto mb-4`}
            >
              <span className="text-white text-3xl font-bold">
                {getInitials(selectedEmployee.name)}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{selectedEmployee.name}</h2>
            <p className="text-gray-500 capitalize">{selectedEmployee.role}</p>
          </div>

          {/* PIN Display */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 text-center mb-3">
              Enter your 6-digit PIN
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                    pin.length > index
                      ? "border-primary bg-primary"
                      : "border-gray-300"
                  }`}
                >
                  {pin.length > index && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PIN Numpad */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                onClick={() => handlePinInput(digit.toString())}
                className="h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-semibold transition-colors"
              >
                {digit}
              </button>
            ))}
            <div />
            <button
              onClick={() => handlePinInput("0")}
              className="h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-semibold transition-colors"
            >
              0
            </button>
            <button
              onClick={handlePinDelete}
              className="h-16 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>

          {/* Start Shift Button */}
          <Button
            onClick={handleStartShift}
            size="lg"
            className="w-full"
            disabled={pin.length !== 6}
          >
            Start Shift
          </Button>

          <button className="w-full text-center text-sm text-primary hover:underline mt-4">
            Forgot PIN?
          </button>
        </div>
      </div>
    </div>
  );
}
