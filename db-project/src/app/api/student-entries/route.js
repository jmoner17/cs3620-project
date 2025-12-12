import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { school, sex, age, weekendAlcoholLevel, finalGrade, absences } = body;

  // Basic validation (keep it light)
  if (!sex || !["F", "M"].includes(sex)) {
    return NextResponse.json(
      { error: "Sex must be 'F' or 'M'." },
      { status: 400 }
    );
  }

  const ageNum = Number(age);
  const walcNum = Number(weekendAlcoholLevel);
  const finalNum = Number(finalGrade);
  const absNum = Number(absences);

  if (
    Number.isNaN(ageNum) ||
    Number.isNaN(walcNum) ||
    Number.isNaN(finalNum) ||
    Number.isNaN(absNum)
  ) {
    return NextResponse.json(
      { error: "Age, weekendAlcoholLevel, finalGrade, and absences must be numbers." },
      { status: 400 }
    );
  }

  // Insert into student_manual_entries
  const { data, error } = await supabase
    .from("student_manual_entries")
    .insert([
      {
        user_id: user.id,
        school: school || null,
        sex,
        age: ageNum,
        weekend_alcohol_level: walcNum,
        final_grade: finalNum,
        absences: absNum,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: "Failed to insert manual entry." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Manual entry saved.",
    entry: data,
  });
}
