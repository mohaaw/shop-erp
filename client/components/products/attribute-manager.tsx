"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttributeValue {
    id?: string;
    value: string;
    priceExtra: number;
}

interface Attribute {
    id?: string;
    name: string;
    values: AttributeValue[];
}

interface AttributeManagerProps {
    attributes: Attribute[];
    onChange: (attributes: Attribute[]) => void;
}

export function AttributeManager({ attributes, onChange }: AttributeManagerProps) {
    const [newAttributeName, setNewAttributeName] = useState("");

    const addAttribute = () => {
        if (!newAttributeName.trim()) return;

        const newAttribute: Attribute = {
            id: crypto.randomUUID(),
            name: newAttributeName,
            values: [],
        };

        onChange([...attributes, newAttribute]);
        setNewAttributeName("");
    };

    const removeAttribute = (id: string) => {
        onChange(attributes.filter((attr) => attr.id !== id));
    };

    const addValue = (attributeId: string, valueName: string) => {
        if (!valueName.trim()) return;

        const updatedAttributes = attributes.map((attr) => {
            if (attr.id === attributeId) {
                return {
                    ...attr,
                    values: [
                        ...attr.values,
                        { id: crypto.randomUUID(), value: valueName, priceExtra: 0 },
                    ],
                };
            }
            return attr;
        });

        onChange(updatedAttributes);
    };

    const removeValue = (attributeId: string, valueId: string) => {
        const updatedAttributes = attributes.map((attr) => {
            if (attr.id === attributeId) {
                return {
                    ...attr,
                    values: attr.values.filter((val) => val.id !== valueId),
                };
            }
            return attr;
        });

        onChange(updatedAttributes);
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <Label>Add Attribute</Label>
                    <Input
                        placeholder="e.g. Color, Size, Material"
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttribute())}
                    />
                </div>
                <Button type="button" onClick={addAttribute} disabled={!newAttributeName.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Attribute
                </Button>
            </div>

            <div className="grid gap-4">
                {attributes.map((attribute) => (
                    <Card key={attribute.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">
                                {attribute.name}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttribute(attribute.id)}
                                className="text-destructive hover:text-destructive/90"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {attribute.values.map((val) => (
                                        <Badge key={val.id} variant="secondary" className="pl-2 pr-1 py-1">
                                            {val.value}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 ml-1 hover:bg-transparent"
                                                onClick={() => removeValue(attribute.id, val.id)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder={`Add ${attribute.name} value...`}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addValue(attribute.id, e.currentTarget.value);
                                                e.currentTarget.value = "";
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
