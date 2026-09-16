-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PrismBase" AS ENUM ('IN', 'OUT', 'UP', 'DOWN');

-- CreateEnum
CREATE TYPE "PersonalizationType" AS ENUM ('SIGNATURE', 'EYEPRINT', 'FREE_EVOLUTION');

-- CreateEnum
CREATE TYPE "FrameType" AS ENUM ('FULL_RIM', 'SEMI_RIMLESS', 'RIMLESS');

-- CreateTable
CREATE TABLE "Patient" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "dni" VARCHAR(8),
    "phone" VARCHAR(30),
    "address" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" UUID NOT NULL,
    "number" SERIAL NOT NULL,
    "patientId" UUID NOT NULL,
    "prescriptionDate" DATE NOT NULL,
    "farOdSphere" DECIMAL(5,2),
    "farOdCylinder" DECIMAL(5,2),
    "farOdAxis" SMALLINT,
    "farOdDnp" DECIMAL(5,2),
    "farOdHeight" DECIMAL(5,2),
    "farOdPrismValue" DECIMAL(5,2),
    "farOdPrismBase" "PrismBase",
    "farOiSphere" DECIMAL(5,2),
    "farOiCylinder" DECIMAL(5,2),
    "farOiAxis" SMALLINT,
    "farOiDnp" DECIMAL(5,2),
    "farOiHeight" DECIMAL(5,2),
    "farOiPrismValue" DECIMAL(5,2),
    "farOiPrismBase" "PrismBase",
    "nearOdSphere" DECIMAL(5,2),
    "nearOdCylinder" DECIMAL(5,2),
    "nearOdAxis" SMALLINT,
    "nearOdDnp" DECIMAL(5,2),
    "nearOdHeight" DECIMAL(5,2),
    "nearOdPrismValue" DECIMAL(5,2),
    "nearOdPrismBase" "PrismBase",
    "nearOiSphere" DECIMAL(5,2),
    "nearOiCylinder" DECIMAL(5,2),
    "nearOiAxis" SMALLINT,
    "nearOiDnp" DECIMAL(5,2),
    "nearOiHeight" DECIMAL(5,2),
    "nearOiPrismValue" DECIMAL(5,2),
    "nearOiPrismBase" "PrismBase",
    "vertexDistance" DECIMAL(5,2),
    "pantoscopicAngle" DECIMAL(5,2),
    "panoramicAngle" DECIMAL(5,2),
    "personalizationType" "PersonalizationType",
    "frameType" "FrameType",
    "ocularDiagnosis" TEXT,
    "refractiveDiagnosis" TEXT,
    "treatment" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_dni_key" ON "Patient"("dni");
CREATE INDEX "Patient_lastName_firstName_idx" ON "Patient"("lastName", "firstName");
CREATE INDEX "Patient_createdAt_idx" ON "Patient"("createdAt" DESC);
CREATE UNIQUE INDEX "Prescription_number_key" ON "Prescription"("number");
CREATE INDEX "Prescription_patientId_prescriptionDate_number_idx" ON "Prescription"("patientId", "prescriptionDate" DESC, "number" DESC);
CREATE INDEX "Prescription_prescriptionDate_number_idx" ON "Prescription"("prescriptionDate" DESC, "number" DESC);

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
