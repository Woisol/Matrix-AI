import asyncio,sys,os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from app.models.playground import Playground
from app.schemas.assignment import CodeLanguage

async def main():
    res = await Playground.run_code(
        code="""#include <iostream>
    using namespace std;

    int main() {
    cout << "Hello, World!" << endl;
    return 0;
    }""",
        input="",
        language=CodeLanguage.C_CPP
    )
    print(res)
    res = await Playground.run_code(
        code="""#include <iostream>
    using namespace std;

    int main() {
    int a = -1;
    cin >> a;
    cout << a << endl;
    return 0;
    }""",
        input="2",
        language=CodeLanguage.C_CPP
    )
    print(res)
if __name__ == "__main__":
    asyncio.run(main())
