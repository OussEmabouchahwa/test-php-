import React, { useEffect, useState } from "react";
import {
  Card, CardBody, Button, Input, Table, TableHeader, TableColumn,
  TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader,
  ModalBody, useDisclosure, Pagination, Tooltip, Alert, Avatar, Spacer
} from "@heroui/react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { AppShell } from "@/layouts/AppShell";
import { fetchPatients, createPatient, updatePatient, deletePatient } from "@/utils/patients";
import type { PatientDoc } from "@/types/patient";
import { PatientForm, PatientFormOut } from "@/components/patients/PatientForm";

const PAGE_SIZE = 10;

const PatientsPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [list, setList] = useState<PatientDoc[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<PatientDoc | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetchPatients(q, page, PAGE_SIZE);
      setList(res.data);
      setTotalPages(res.meta.pages || 1);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [q, page]);

  const onCreate = async (values: PatientFormOut) => {
    setErrorMsg(null); setSuccessMsg(null);
    try {
      await createPatient(values as any);
      setSuccessMsg("Patient created.");
      onOpenChange(); // close
      setPage(1);
      await load();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create patient");
    }
  };

  const onUpdate = async (values: PatientFormOut) => {
    if (!editing) return;
    setErrorMsg(null); setSuccessMsg(null);
    try {
      await updatePatient(editing._id, values as any);
      setSuccessMsg("Patient updated.");
      setEditing(null);
      onOpenChange();
      await load();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update patient");
    }
  };

  const onDelete = async (id: string) => {
    setErrorMsg(null); setSuccessMsg(null);
    if (!confirm("Delete this patient? This action cannot be undone.")) return;
    try {
      await deletePatient(id);
      setSuccessMsg("Patient deleted.");
      await load();
    } catch (err: any) {
      // e.g., 409 Cannot delete: patient has visits
      setErrorMsg(err?.message || "Failed to delete patient");
    }
  };

  const openCreate = () => {
    setEditing(null);
    onOpen();
  };

  const openEdit = (p: PatientDoc) => {
    setEditing(p);
    onOpen();
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Input
            startContent={<Search className="size-4" />}
            placeholder="Search name, phone…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <Button color="primary" startContent={<Plus className="size-4" />} onPress={openCreate}>
          New Patient
        </Button>
      </div>

      {errorMsg && (
        <Alert color="danger" variant="flat" title="Error" description={errorMsg} isClosable onClose={() => setErrorMsg(null)} className="mb-4" />
      )}
      {successMsg && (
        <Alert color="success" variant="flat" title="Success" description={successMsg} isClosable onClose={() => setSuccessMsg(null)} className="mb-4" />
      )}

      <Card>
        <CardBody>
          <Table aria-label="Patients table" isStriped removeWrapper>
            <TableHeader>
              <TableColumn>Photo</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Phone</TableColumn>
              <TableColumn>DOB</TableColumn>
              <TableColumn>First Visit</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={loading}
              emptyContent={loading ? "Loading..." : "No patients found"}
            >
              {list.map(p => {
                const photo = p.user?.avatarUrl || p.idPhotoUrl || "";
                const displayName = p.name || p.user?.name || "";
                const initials = displayName ? displayName.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase() : "PT";
                return (
                  <TableRow key={p._id}>
                    <TableCell>
                      <Avatar src={photo || undefined} name={displayName || "Patient"} color="default" />
                    </TableCell>
                    <TableCell className="font-medium">{displayName}</TableCell>
                    <TableCell>{p.user?.email}</TableCell>
                    <TableCell>{p.phone || p.user?.phone || "-"}</TableCell>
                    <TableCell>{p.dob ? new Date(p.dob).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{p.firstVisitAt ? new Date(p.firstVisitAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip content="Edit">
                          <Button size="sm" isIconOnly variant="light" onPress={() => openEdit(p)}>
                            <Pencil className="size-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete">
                          <Button size="sm" isIconOnly variant="light" color="danger" onPress={() => onDelete(p._id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <Pagination total={totalPages} page={page} onChange={setPage} />
          </div>
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="lg" scrollBehavior="inside">
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>{editing ? "Edit patient" : "New patient"}</ModalHeader>
              <ModalBody>
                <PatientForm
                  defaultValues={editing ? {
                    name: editing.name || editing.user?.name,
                    email: editing.user?.email,
                    phone: editing.phone || editing.user?.phone,
                    dob: editing.dob ? editing.dob.substring(0, 10) : undefined,
                    notes: editing.notes,
                  } : {}}
                  initialPhotoUrl={editing ? (editing.user?.avatarUrl || editing.idPhotoUrl || null) : null}
                  onSubmit={editing ? onUpdate : onCreate}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </AppShell>
  );
};

export default PatientsPage;
