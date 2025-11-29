"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "@/lib/validations/product";

interface VariantMatrixProps {
    attributes: {
        name: string;
        values: { value: string }[];
    }[];
}

export function VariantMatrix({ attributes }: VariantMatrixProps) {
    const form = useFormContext<ProductFormValues>();
    const [variants, setVariants] = useState<NonNullable<ProductFormValues['variants']>>([]);

    // Helper to generate Cartesian product
    const cartesian = <T,>(args: T[][]): T[][] => {
        const r: T[][] = [];
        const max = args.length - 1;
        function helper(arr: T[], i: number) {
            for (let j = 0, l = args[i].length; j < l; j++) {
                const a = arr.slice(0); // clone arr
                a.push(args[i][j]);
                if (i === max) r.push(a);
                else helper(a, i + 1);
            }
        }
        helper([], 0);
        return r;
    };

    useEffect(() => {
        if (!attributes || attributes.length === 0) {
            setVariants([]);
            return;
        }

        // Filter out empty attributes
        const validAttributes = attributes.filter(
            (attr) => attr.name && attr.values && attr.values.length > 0
        );

        if (validAttributes.length === 0) return;

        // Generate combinations
        const combinations = cartesian(
            validAttributes.map((attr) => attr.values.map((v) => ({ name: attr.name, value: v.value })))
        );

        // Map to variant objects, preserving existing data if possible
        const currentVariants = form.getValues("variants") || [];

        const newVariants = combinations.map((combo) => {
            const name = combo.map((c) => c.value).join(" / ");
            const attributeMap = combo.reduce((acc, curr) => {
                acc[curr.name] = curr.value;
                return acc;
            }, {} as Record<string, string>);

            // Try to find existing variant to preserve price/stock/sku
            const existing = currentVariants.find((v) => {
                // Simple matching by name for now, could be more robust with ID or attribute matching
                return v.name === name;
            });

            return {
                id: existing?.id || crypto.randomUUID(),
                name,
                price: existing?.price || form.getValues("price") || 0,
                stock: existing?.stock || 0,
                sku: existing?.sku || "",
                attributes: attributeMap,
            };
        });

        setVariants(newVariants);
        form.setValue("variants", newVariants);
    }, [attributes, form.getValues("price")]); // Re-run when attributes change

    if (variants.length === 0) return null;

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Variant Matrix</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Variant</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>SKU</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variants.map((variant, index) => (
                            <TableRow key={variant.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(variant.attributes).map(([key, value]) => (
                                            <Badge key={key} variant="outline">
                                                {value as string}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        defaultValue={variant.price}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            form.setValue(`variants.${index}.price`, val);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        defaultValue={variant.stock}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            form.setValue(`variants.${index}.stock`, val);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        defaultValue={variant.sku}
                                        onChange={(e) => {
                                            form.setValue(`variants.${index}.sku`, e.target.value);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
