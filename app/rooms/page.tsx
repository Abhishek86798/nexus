'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Building, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { sampleRooms, Room } from "@/data/sampleData";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(sampleRooms);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    type: 'classroom' as Room['type'],
    capacity: 30,
    building: '',
    floor: 1,
    features: '',
    isAvailable: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRoom: Room = {
      id: editingRoom ? editingRoom.id : Date.now().toString(),
      number: formData.number,
      type: formData.type,
      capacity: formData.capacity,
      building: formData.building,
      floor: formData.floor,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      isAvailable: formData.isAvailable
    };

    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? newRoom : r));
    } else {
      setRooms([...rooms, newRoom]);
    }

    resetForm();
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      features: room.features.join(', '),
      isAvailable: room.isAvailable
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const toggleAvailability = (id: string) => {
    setRooms(rooms.map(r => 
      r.id === id ? { ...r, isAvailable: !r.isAvailable } : r
    ));
  };

  const resetForm = () => {
    setFormData({
      number: '',
      type: 'classroom',
      capacity: 30,
      building: '',
      floor: 1,
      features: '',
      isAvailable: true
    });
    setEditingRoom(null);
    setIsFormOpen(false);
  };

  const getRoomTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'classroom': return 'bg-blue-100 text-blue-800';
      case 'laboratory': return 'bg-green-100 text-green-800';
      case 'auditorium': return 'bg-purple-100 text-purple-800';
      case 'seminar': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="h-8 w-8 text-purple-600" />
              Rooms Management
            </h1>
            <p className="text-gray-600">Manage classroom and laboratory spaces</p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Form Card */}
          {isFormOpen && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Room Number</Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => setFormData({...formData, number: e.target.value})}
                        placeholder="A101"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Room Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData({...formData, type: value as Room['type']})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classroom">Classroom</SelectItem>
                          <SelectItem value="laboratory">Laboratory</SelectItem>
                          <SelectItem value="auditorium">Auditorium</SelectItem>
                          <SelectItem value="seminar">Seminar Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        max="500"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 30})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="building">Building</Label>
                      <Input
                        id="building"
                        value={formData.building}
                        onChange={(e) => setFormData({...formData, building: e.target.value})}
                        placeholder="Academic Block A"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="floor">Floor</Label>
                      <Select 
                        value={formData.floor.toString()} 
                        onValueChange={(value) => setFormData({...formData, floor: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Ground Floor</SelectItem>
                          <SelectItem value="1">1st Floor</SelectItem>
                          <SelectItem value="2">2nd Floor</SelectItem>
                          <SelectItem value="3">3rd Floor</SelectItem>
                          <SelectItem value="4">4th Floor</SelectItem>
                          <SelectItem value="5">5th Floor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAvailable"
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked})}
                      />
                      <Label htmlFor="isAvailable">Available for scheduling</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Input
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      placeholder="Projector, Whiteboard, AC, Computers"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {editingRoom ? 'Update Room' : 'Add Room'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Rooms Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Rooms ({rooms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{room.number}</div>
                            <div className="text-sm text-gray-600">Floor {room.floor}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoomTypeColor(room.type)}>
                            {room.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{room.building}</TableCell>
                        <TableCell>{room.capacity} seats</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {room.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {room.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{room.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {room.isAvailable ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAvailability(room.id)}
                              className={room.isAvailable ? "text-red-600" : "text-green-600"}
                            >
                              {room.isAvailable ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(room)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(room.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}